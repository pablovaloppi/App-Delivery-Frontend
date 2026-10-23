/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { merchantService } from '../../services/api/merchantService';
import { formatMoney } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';

export const MerchantCatalogView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Pizzas Individuales');

  const loadProducts = async () => {
    const list = await merchantService.getProducts();
    setProducts(list);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggle = async (productId: string) => {
    await merchantService.toggleProductAvailability(productId);
    await loadProducts();
  };

  const handleSavePrice = async () => {
    if (!editingProduct) return;
    const amount = parseInt(editPrice, 10);
    if (!isNaN(amount) && amount > 0) {
      await merchantService.updateProductPrice(editingProduct.id, amount);
      await loadProducts();
    }
    setEditingProduct(null);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(newPrice, 10);
    if (!newName || isNaN(amount) || amount <= 0) return;

    await merchantService.addProduct({
      merchantId: 'm_001',
      name: newName,
      description: newDesc || 'Plato añadido desde la consola de cocina.',
      price: { amount, currency: 'ARS' },
      category: newCategory,
      isAvailable: true,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1M7Mg45uX3OyBsaPqtQ9tVOWvvMSAPUVGbQLIxHRg0-akEH1yjadH8cr0OYB90OEoyymUXwcqK_BHVEHoRTmt6sihAzBPV5HYZTF2OoqII2SvfFsoymfsoZwPFpJ9OTxb-gWANErGDeFESSzwyhZ8jAoj7NEsxgEg36urO8DJLfrvNxtjNHQgeRC0nKVDmhsUDfV116y0uXtdk-BSWHc4iTtEq6rr6KYYMlaziHvFhUpRa9SC_Unng',
    });

    setNewName('');
    setNewDesc('');
    setNewPrice('');
    setIsAddModalOpen(false);
    await loadProducts();
  };

  const filtered = products.filter((p) => {
    if (!search) return true;
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="flex-1 flex flex-col space-y-4 px-4 pt-3 select-none pb-24">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[var(--text-secondary)] text-[18px]">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en catálogo..."
            className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl pl-9 pr-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--brand)]"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="h-9 px-3.5 bg-[var(--brand)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-pressed)] text-white text-xs font-bold rounded-xl flex items-center gap-1 shrink-0 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Nuevo Plato</span>
        </button>
      </div>

      {/* Catalog Items Feed */}
      <section className="space-y-2.5">
        <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] font-bold px-1">
          <span>Platos registrados ({filtered.length})</span>
          <span>Disponibilidad en Carta</span>
        </div>

        <div className="space-y-2.5">
          {filtered.map((product) => (
            <article
              key={product.id}
              className={`p-3 rounded-2xl bg-[var(--surface)] border transition-all flex items-center justify-between gap-3 shadow-xs ${
                product.isAvailable ? 'border-[var(--border)]' : 'border-dashed border-stone-300 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 bg-[var(--surface-alt)]"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-[var(--text)] truncate">
                      {product.name}
                    </h3>
                    <span className="text-[9px] bg-[var(--surface-alt)] px-1.5 py-0.2 rounded font-semibold text-[var(--text-secondary)]">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-extrabold text-[var(--text)]">
                      {formatMoney(product.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(product);
                        setEditPrice(product.price.amount.toString());
                      }}
                      className="text-[10px] text-[var(--brand)] font-bold hover:underline"
                    >
                      Editar precio
                    </button>
                  </div>
                </div>
              </div>

              {/* Availability Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggle(product.id)}
                className="flex flex-col items-end gap-1 cursor-pointer shrink-0"
                aria-label={`Cambiar disponibilidad de ${product.name}`}
              >
                <div
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    product.isAvailable ? 'bg-[var(--success)]' : 'bg-[var(--surface-alt)]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      product.isAvailable ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
                <span
                  className={`text-[9px] font-bold ${
                    product.isAvailable ? 'text-[var(--success)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {product.isAvailable ? 'Disponible' : 'Pausado'}
                </span>
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Edit Price Modal */}
      {editingProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="w-full max-w-xs bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-[var(--text)]">
              Editar precio de {editingProduct.name}
            </h3>
            <div>
              <label htmlFor="price-input" className="text-[10px] text-[var(--text-secondary)] block mb-1">
                Precio de venta (ARS):
              </label>
              <input
                id="price-input"
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl p-2.5 text-sm font-bold text-[var(--text)] outline-none focus:border-[var(--brand)]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setEditingProduct(null)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleSavePrice}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <form
            onSubmit={handleCreateProduct}
            className="w-full max-w-sm bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-xl space-y-3"
          >
            <h3 className="text-sm font-bold text-[var(--text)]">Agregar Nuevo Plato</h3>

            <div>
              <label htmlFor="prod-name" className="text-[10px] text-[var(--text-secondary)] block mb-0.5">
                Nombre del plato:
              </label>
              <input
                id="prod-name"
                required
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej: Pizza Calzone Relleno"
                className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl p-2 text-xs text-[var(--text)] outline-none focus:border-[var(--brand)]"
              />
            </div>

            <div>
              <label htmlFor="prod-desc" className="text-[10px] text-[var(--text-secondary)] block mb-0.5">
                Descripción / Ingredientes:
              </label>
              <textarea
                id="prod-desc"
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Ej: Mozzarella, jamón cocido natural, ricota y salsa pomodoro."
                className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl p-2 text-xs text-[var(--text)] outline-none focus:border-[var(--brand)] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="prod-price" className="text-[10px] text-[var(--text-secondary)] block mb-0.5">
                  Precio (ARS):
                </label>
                <input
                  id="prod-price"
                  required
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="13500"
                  className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl p-2 text-xs font-bold text-[var(--text)] outline-none focus:border-[var(--brand)]"
                />
              </div>

              <div>
                <label htmlFor="prod-category" className="text-[10px] text-[var(--text-secondary)] block mb-0.5">
                  Categoría:
                </label>
                <select
                  id="prod-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl p-2 text-xs text-[var(--text)] outline-none focus:border-[var(--brand)]"
                >
                  <option value="Populares">Populares</option>
                  <option value="Pizzas Individuales">Pizzas Individuales</option>
                  <option value="Pizzas Familiares">Pizzas Familiares</option>
                  <option value="Postres">Postres</option>
                  <option value="Bebidas">Bebidas</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Crear Plato
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
