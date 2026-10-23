/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  AppNotification,
  CustomerLoyaltyProfile,
  LoyaltyCoupon,
  ReviewFeedback,
  ReviewTargetType,
  SimulationStep,
} from '../types/ecosystem';
import { OrderViewModel, UserRole } from '../types';
import {
  mockInitialLoyaltyProfile,
  mockInitialNotifications,
  mockInitialReviews,
  mockLoyaltyCoupons,
} from '../data/ecosystemMockData';
import {
  calculateLoyaltyPoints,
  countUnreadNotifications,
  getNextSimulationStep,
  redeemCoupon as redeemCouponLogic,
  SIMULATION_STEPS,
} from '../utils/ecosystemLogic';
import { soundEffects } from '../services/soundEffects';

interface EcosystemContextType {
  // Reviews
  reviews: ReviewFeedback[];
  isReviewModalOpen: boolean;
  reviewModalOrder: OrderViewModel | null;
  reviewModalTarget: ReviewTargetType;
  openReviewModal: (order: OrderViewModel, target?: ReviewTargetType) => void;
  closeReviewModal: () => void;
  submitReview: (feedback: {
    targetType: ReviewTargetType;
    rating: number;
    tags: string[];
    comment?: string;
    courierTipBonus?: number;
  }) => void;

  // Loyalty Program ("Comunidad Porteña")
  loyaltyProfile: CustomerLoyaltyProfile;
  availableCoupons: LoyaltyCoupon[];
  isLoyaltyModalOpen: boolean;
  openLoyaltyModal: () => void;
  closeLoyaltyModal: () => void;
  redeemCoupon: (coupon: LoyaltyCoupon) => { success: boolean; message: string };

  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  isNotificationCenterOpen: boolean;
  openNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  soundEnabled: boolean;
  toggleSound: () => void;

  // End-to-End Simulation Mode
  simulationStepIndex: number;
  currentSimulationStep: SimulationStep;
  isSimulationOpen: boolean;
  isSimulationAutoPlay: boolean;
  simulatedOrder: OrderViewModel;
  openSimulation: () => void;
  closeSimulation: () => void;
  toggleSimulationAutoPlay: () => void;
  advanceSimulationStep: (onRoleChangeRequested?: (role: UserRole) => void) => void;
  jumpToSimulationStep: (index: number, onRoleChangeRequested?: (role: UserRole) => void) => void;
  resetSimulation: (onRoleChangeRequested?: (role: UserRole) => void) => void;
}

const EcosystemContext = createContext<EcosystemContextType | undefined>(undefined);

const initialSimulatedOrder: OrderViewModel = {
  id: 'ord-sim-1043',
  orderNumber: 1043,
  merchantId: 'merch-1',
  merchantName: 'Pizzería Napolitana Gourmet',
  merchantLogo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDkyT7lLmF9ZsL-SMNaUrRVgfPAF-OPX9-ezHFrEH9oXJ_ge_PpsoJ6tgQ-Mg97tTmkRMd7FAeMHIil2b8ugt5b46USLUPhNW-tPLdmLTUsX4iQ6tBvz9jYYm5bfJFdSSnjZKAGP-zL7DL84iCgBRMd9aqDlukbbt6U30xfrLr7ZnVsYJ-IcLwv4sZPqKoCck39uOOEqXpUjqwZXOg2XfBjZv-jdSiNUwbascsVniXY5ZMDnhxF8qy_0w',
  customerId: 'usr-customer-1',
  courierId: 'usr-courier-1',
  courierName: 'Carlos Gómez',
  status: 'PENDING',
  deliveryType: 'platform',
  items: [
    {
      productId: 'prod-1',
      name: 'Pizza Margherita Especial',
      quantity: 1,
      unitPrice: { amount: 12500, currency: 'ARS' },
      totalPrice: { amount: 12500, currency: 'ARS' },
      notes: 'Masa madre bien crocante',
    },
    {
      productId: 'prod-6',
      name: 'Cerveza Moretti 330ml',
      quantity: 1,
      unitPrice: { amount: 3200, currency: 'ARS' },
      totalPrice: { amount: 3200, currency: 'ARS' },
    },
  ],
  subtotal: { amount: 15700, currency: 'ARS' },
  deliveryFee: { amount: 1450, currency: 'ARS' },
  tip: { amount: 1200, currency: 'ARS' },
  discount: { amount: 0, currency: 'ARS' },
  total: { amount: 18350, currency: 'ARS' },
  deliveryAddress: {
    id: 'addr-1',
    label: 'Casa',
    street: 'Av. Corrientes',
    number: '1234',
    apartment: 'Piso 4 B',
    city: 'CABA',
    instructions: 'Tocar timbre 4B',
    isDefault: true,
  },
  createdAt: new Date().toISOString(),
  estimatedDeliveryTime: 'En 25-35 min',
};

export const EcosystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Reviews state
  const [reviews, setReviews] = useState<ReviewFeedback[]>(mockInitialReviews);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewModalOrder, setReviewModalOrder] = useState<OrderViewModel | null>(null);
  const [reviewModalTarget, setReviewModalTarget] = useState<ReviewTargetType>('merchant');

  // Loyalty state
  const [loyaltyProfile, setLoyaltyProfile] = useState<CustomerLoyaltyProfile>(mockInitialLoyaltyProfile);
  const [availableCoupons, setAvailableCoupons] = useState<LoyaltyCoupon[]>(mockLoyaltyCoupons);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(mockInitialNotifications);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Simulation state
  const [simulationStepIndex, setSimulationStepIndex] = useState(0);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isSimulationAutoPlay, setIsSimulationAutoPlay] = useState(false);
  const [simulatedOrder, setSimulatedOrder] = useState<OrderViewModel>(initialSimulatedOrder);
  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const unreadCount = countUnreadNotifications(notifications);

  // Review modal actions
  const openReviewModal = (order: OrderViewModel, target: ReviewTargetType = 'merchant') => {
    setReviewModalOrder(order);
    setReviewModalTarget(target);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewModalOrder(null);
  };

  const submitReview = (feedback: {
    targetType: ReviewTargetType;
    rating: number;
    tags: string[];
    comment?: string;
    courierTipBonus?: number;
  }) => {
    const order = reviewModalOrder || initialSimulatedOrder;
    const targetName =
      feedback.targetType === 'merchant'
        ? order.merchantName
        : order.courierName || 'Cadete de la plataforma';

    const newReview: ReviewFeedback = {
      id: `rev-${Date.now()}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      targetType: feedback.targetType,
      targetId: feedback.targetType === 'merchant' ? order.merchantId : (order.courierId || 'cadete-1'),
      targetName,
      authorId: 'usr-customer-1',
      authorName: 'Martín Rodríguez',
      rating: feedback.rating,
      tags: feedback.tags,
      comment: feedback.comment,
      createdAt: new Date().toISOString(),
      courierTipAdded: feedback.courierTipBonus
        ? { amount: feedback.courierTipBonus, currency: 'ARS' }
        : undefined,
    };

    setReviews((prev) => [newReview, ...prev]);

    // Award bonus loyalty points for reviewing
    const reviewBonusPoints = 50;
    setLoyaltyProfile((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + reviewBonusPoints,
      lifetimePoints: prev.lifetimePoints + reviewBonusPoints,
    }));

    soundEffects.playSuccessChime();

    // Add confirmation notification
    addNotification({
      title: '¡Gracias por calificar en FoodieLocal!',
      message: `Tu reseña sobre ${targetName} fue registrada. Sumaste +${reviewBonusPoints} Puntos Porteños.`,
      targetRole: 'customer',
      type: 'LOYALTY_REWARD',
      orderNumber: order.orderNumber,
    });

    closeReviewModal();
  };

  // Loyalty actions
  const openLoyaltyModal = () => setIsLoyaltyModalOpen(true);
  const closeLoyaltyModal = () => setIsLoyaltyModalOpen(false);

  const redeemCoupon = (coupon: LoyaltyCoupon): { success: boolean; message: string } => {
    const result = redeemCouponLogic(loyaltyProfile.totalPoints, coupon);
    if (!result.success) {
      return { success: false, message: result.error || 'Error al canjear' };
    }

    setLoyaltyProfile((prev) => ({
      ...prev,
      totalPoints: result.newPoints,
      redeemedCoupons: [...prev.redeemedCoupons, coupon],
    }));

    setAvailableCoupons((prev) => prev.filter((c) => c.id !== coupon.id));

    soundEffects.playCashRegisterChime();

    addNotification({
      title: '¡Cupón de Descuento Activado!',
      message: `Canjeaste ${coupon.title}. El código ${coupon.code} ya está disponible en tu checkout.`,
      targetRole: 'customer',
      type: 'LOYALTY_REWARD',
    });

    return { success: true, message: `¡Cupón ${coupon.code} canjeado con éxito!` };
  };

  // Notification actions
  const openNotificationCenter = () => setIsNotificationCenterOpen(true);
  const closeNotificationCenter = () => setIsNotificationCenterOpen(false);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (
    notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: 'Ahora',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    soundEffects.playComandaChime();
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.setSoundEnabled(next);
    if (next) soundEffects.playCashRegisterChime();
  };

  // Simulation controls
  const openSimulation = () => setIsSimulationOpen(true);
  const closeSimulation = () => {
    setIsSimulationOpen(false);
    setIsSimulationAutoPlay(false);
  };

  const toggleSimulationAutoPlay = () => {
    setIsSimulationAutoPlay((prev) => !prev);
  };

  const jumpToSimulationStep = useCallback((index: number, onRoleChangeRequested?: (role: UserRole) => void) => {
    const safeIndex = Math.max(0, Math.min(SIMULATION_STEPS.length - 1, index));
    const step = SIMULATION_STEPS[safeIndex];

    setSimulationStepIndex(safeIndex);
    setSimulatedOrder((prev) => ({
      ...prev,
      status: step.orderStatus,
    }));

    if (onRoleChangeRequested) {
      onRoleChangeRequested(step.role);
    }

    // Play appropriate audio chime based on status
    if (step.orderStatus === 'DELIVERED') {
      soundEffects.playSuccessChime();
    } else {
      soundEffects.playComandaChime();
    }

    // Emits real notification reflecting the simulated step
    addNotification({
      title: `Simulación E2E: ${step.title}`,
      message: step.description,
      targetRole: step.role,
      type: 'ORDER_UPDATE',
      orderNumber: 1043,
    });
  }, []);

  const advanceSimulationStep = useCallback((onRoleChangeRequested?: (role: UserRole) => void) => {
    const next = getNextSimulationStep(simulationStepIndex);
    jumpToSimulationStep(next.nextIndex, onRoleChangeRequested);
  }, [simulationStepIndex, jumpToSimulationStep]);

  const resetSimulation = (onRoleChangeRequested?: (role: UserRole) => void) => {
    setSimulationStepIndex(0);
    setSimulatedOrder({
      ...initialSimulatedOrder,
      status: 'PENDING',
    });
    if (onRoleChangeRequested) {
      onRoleChangeRequested('customer');
    }
  };

  // Auto-play timer effect
  useEffect(() => {
    if (!isSimulationAutoPlay) {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setTimeout(() => {
      advanceSimulationStep();
    }, 4500);

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isSimulationAutoPlay, simulationStepIndex, advanceSimulationStep]);

  return (
    <EcosystemContext.Provider
      value={{
        reviews,
        isReviewModalOpen,
        reviewModalOrder,
        reviewModalTarget,
        openReviewModal,
        closeReviewModal,
        submitReview,

        loyaltyProfile,
        availableCoupons,
        isLoyaltyModalOpen,
        openLoyaltyModal,
        closeLoyaltyModal,
        redeemCoupon,

        notifications,
        unreadCount,
        isNotificationCenterOpen,
        openNotificationCenter,
        closeNotificationCenter,
        markAsRead,
        markAllAsRead,
        addNotification,
        soundEnabled,
        toggleSound,

        simulationStepIndex,
        currentSimulationStep: SIMULATION_STEPS[simulationStepIndex],
        isSimulationOpen,
        isSimulationAutoPlay,
        simulatedOrder,
        openSimulation,
        closeSimulation,
        toggleSimulationAutoPlay,
        advanceSimulationStep,
        jumpToSimulationStep,
        resetSimulation,
      }}
    >
      {children}
    </EcosystemContext.Provider>
  );
};

export const useEcosystem = () => {
  const context = useContext(EcosystemContext);
  if (!context) {
    throw new Error('useEcosystem must be used within an EcosystemProvider');
  }
  return context;
};
