import {
  ArrowRightLeft,
  BarChart3,
  Bell,
  Car,
  Cloud,
  CreditCard,
  Fingerprint,
  KeyRound,
  Receipt,
  ShoppingBag,
  Wallet,
} from 'lucide-react-native';

import {theme} from '../theme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComponent = React.ComponentType<any>;

type IconConfig = {
  Icon: IconComponent;
  color: string;
  bg: string;
};

const categoryIcons: Record<string, IconConfig> = {
  Groceries: {
    Icon: ShoppingBag,
    color: theme.colors.semantic.success,
    bg: theme.colors.semantic.successSoft,
  },
  Income: {
    Icon: Wallet,
    color: theme.colors.base.yellow,
    bg: theme.colors.semantic.warningSoft,
  },
  Transport: {
    Icon: Car,
    color: theme.colors.semantic.info,
    bg: theme.colors.semantic.infoSoft,
  },
  Subscription: {
    Icon: Cloud,
    color: theme.colors.text.muted,
    bg: theme.colors.background.subtle,
  },
};

const defaultCategoryIcon: IconConfig = {
  Icon: CreditCard,
  color: theme.colors.text.muted,
  bg: theme.colors.background.subtle,
};

export const getCategoryIcon = (category: string): IconConfig =>
  categoryIcons[category] ?? defaultCategoryIcon;

export const quickActionIcons: Record<string, IconComponent> = {
  Transfer: ArrowRightLeft,
  'Pay Bills': Receipt,
  Insights: BarChart3,
};

export const securityIcons: Record<string, IconComponent> = {
  'sec-1': Fingerprint,
  'sec-2': KeyRound,
  'sec-3': Bell,
};
