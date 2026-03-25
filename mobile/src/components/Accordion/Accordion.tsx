/**
 * Neo Accordion — React Native
 *
 * Customisation surface:
 *   variant          'default' | 'separated' | 'bordered' | 'ghost'
 *   size             'sm' | 'md' | 'lg'
 *   iconPlacement    'left' | 'right' | 'none'
 *   icon             Custom expand indicator (replaces chevron)
 *   multiple         Allow many panels open simultaneously
 *
 * Per-item overrides (AccordionItem):
 *   title            string | ReactNode
 *   subtitle         secondary line below title
 *   badge            pill count / label next to title
 *   headerLeft       arbitrary ReactNode injected left of title
 *   iconPlacement    overrides parent setting for this item
 *   icon             overrides parent chevron for this item
 *   renderHeader     full render-prop escape hatch for the header row
 *   contentPadding   toggle default content padding
 *   headerStyle      ViewStyle for the header row
 *   contentStyle     ViewStyle for the content wrapper
 *   disabled         prevent expansion
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AccordionVariant = 'default' | 'separated' | 'bordered' | 'ghost';
export type AccordionSize    = 'sm' | 'md' | 'lg';
export type IconPlacement    = 'left' | 'right' | 'none';

/** Render-prop signature for fully custom headers */
export interface AccordionHeaderRenderProps {
  isOpen:  boolean;
  toggle:  () => void;
  disabled?: boolean;
}

export interface AccordionItemProps {
  /** Unique ID used to track open state */
  id: string;

  // ── Header content ─────────────────────────────────────────────────────────
  /** Main header title — string for simple, ReactNode for custom layout */
  title: string | React.ReactNode;
  /** Secondary line rendered below the title */
  subtitle?: string;
  /** Pill badge rendered after the title */
  badge?: string | number;
  /** Leading slot: icon/avatar left of the title block */
  headerLeft?: React.ReactNode;

  // ── Icon customisation ────────────────────────────────────────────────────
  /** Override the parent Accordion's iconPlacement for this item */
  iconPlacement?: IconPlacement;
  /** Override the parent Accordion's expand icon for this item */
  icon?: React.ReactNode;

  // ── Full escape hatch ─────────────────────────────────────────────────────
  /**
   * Render the entire header row yourself.
   * Receives `{ isOpen, toggle, disabled }` — you are responsible for calling
   * `toggle()` on press.
   */
  renderHeader?: (props: AccordionHeaderRenderProps) => React.ReactNode;

  // ── State ─────────────────────────────────────────────────────────────────
  disabled?: boolean;
  /** Uncontrolled initial open state (evaluated once on mount) */
  defaultOpen?: boolean;

  // ── Styling ───────────────────────────────────────────────────────────────
  /** Pad the content area (default true) */
  contentPadding?: boolean;
  /** Extra styles for the root wrapper */
  style?: ViewStyle;
  /** Extra styles for the header row */
  headerStyle?: ViewStyle;
  /** Extra styles for the content wrapper */
  contentStyle?: ViewStyle;

  children?: React.ReactNode;
}

export interface AccordionProps {
  children: React.ReactNode;

  // ── Behaviour ─────────────────────────────────────────────────────────────
  /** Allow multiple panels open at the same time (default false) */
  multiple?: boolean;
  /** Uncontrolled initial open IDs */
  defaultOpen?: string[];
  /** Controlled open IDs */
  openIds?: string[];
  /** Called whenever the open set changes */
  onChange?: (openIds: string[]) => void;

  // ── Appearance ────────────────────────────────────────────────────────────
  variant?: AccordionVariant;
  size?: AccordionSize;

  // ── Icon defaults (overridable per-item) ──────────────────────────────────
  /** Where to place the expand indicator (default 'right') */
  iconPlacement?: IconPlacement;
  /** Replace the default chevron with any ReactNode */
  icon?: React.ReactNode;

  /** Show a divider between items — defaults to true for 'default'/'bordered' */
  divider?: boolean;

  style?: ViewStyle;
}

// ─── Size config ──────────────────────────────────────────────────────────────

interface SizeCfg {
  minHeaderH: number;
  fontSize:   number;
  subFontSize: number;
  ph:          number; // horizontal padding
  pv:          number; // vertical padding (header & content)
  iconSize:    number;
  badgeH:      number;
  badgeFs:     number;
  gap:         number; // gap inside header row
}

const SIZE: Record<AccordionSize, SizeCfg> = {
  sm: { minHeaderH: 44, fontSize: 13, subFontSize: 11, ph: spacing[3],  pv: spacing[3],  iconSize: 14, badgeH: 18, badgeFs: 10, gap: spacing[2] },
  md: { minHeaderH: 52, fontSize: 15, subFontSize: 12, ph: spacing[4],  pv: spacing[4],  iconSize: 16, badgeH: 20, badgeFs: 11, gap: spacing[3] },
  lg: { minHeaderH: 60, fontSize: 17, subFontSize: 13, ph: spacing[5],  pv: spacing[5],  iconSize: 18, badgeH: 22, badgeFs: 12, gap: spacing[3] },
};

// ─── Accordion Context ────────────────────────────────────────────────────────

interface AccordionCtx {
  openIds:      Set<string>;
  toggle:       (id: string) => void;
  variant:      AccordionVariant;
  size:         AccordionSize;
  iconPlacement: IconPlacement;
  icon?:        React.ReactNode;
  divider:      boolean;
  isLastItem:   (id: string) => boolean;
}

const Ctx = createContext<AccordionCtx>({
  openIds:      new Set(),
  toggle:       () => undefined,
  variant:      'default',
  size:         'md',
  iconPlacement: 'right',
  divider:      true,
  isLastItem:   () => false,
});

// ─── Chevron icon (inline, no external deps) ──────────────────────────────────

const DefaultChevron: React.FC<{ size: number; animValue: Animated.Value }> = ({ size, animValue }) => {
  const rotate = animValue.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <View style={[chevronStyles.chevron, { width: size * 0.55, height: size * 0.55 }]} />
    </Animated.View>
  );
};

const chevronStyles = StyleSheet.create({
  chevron: {
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: colors.textTertiary,
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
  },
});

// ─── AccordionItem ────────────────────────────────────────────────────────────

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  title,
  subtitle,
  badge,
  headerLeft,
  iconPlacement: itemIconPlacement,
  icon: itemIcon,
  renderHeader,
  disabled = false,
  defaultOpen,
  contentPadding = true,
  style,
  headerStyle,
  contentStyle,
  children,
}) => {
  const {
    openIds,
    toggle,
    variant,
    size,
    iconPlacement: ctxIconPlacement,
    icon: ctxIcon,
    divider,
    isLastItem,
  } = useContext(Ctx);

  const cfg       = SIZE[size];
  const placement = itemIconPlacement ?? ctxIconPlacement;
  const expandIcon = itemIcon ?? ctxIcon; // undefined = use default chevron

  // ── Controlled open state from parent ──
  const isOpen = openIds.has(id);
  const handleToggle = useCallback(() => {
    if (!disabled) toggle(id);
  }, [disabled, toggle, id]);

  // ── Initialise uncontrolled defaultOpen ──
  const didInit = useRef(false);
  useEffect(() => {
    if (!didInit.current && defaultOpen) {
      toggle(id);
    }
    didInit.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Height animation ──────────────────────────────────────────────────────
  const [contentH, setContentH] = useState(0);
  const [measured, setMeasured] = useState(false);
  const heightAnim  = useRef(new Animated.Value(0)).current;
  const chevronAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  const onContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      if (h === 0) return;
      if (!measured) {
        // First measure — jump to correct position, no animation glitch
        setMeasured(true);
        setContentH(h);
        heightAnim.setValue(isOpen ? h : 0);
      } else if (h !== contentH) {
        // Content resized — update ceiling
        setContentH(h);
        if (isOpen) heightAnim.setValue(h);
      }
    },
    [measured, contentH, isOpen, heightAnim],
  );

  useEffect(() => {
    if (!measured || contentH === 0) return;
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue:         isOpen ? contentH : 0,
        duration:        280,
        easing:          Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(chevronAnim, {
        toValue:         isOpen ? 1 : 0,
        duration:        260,
        easing:          Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, measured, contentH, heightAnim, chevronAnim]);

  // ── Variant styles ────────────────────────────────────────────────────────
  const isLast    = isLastItem(id);
  const showDivider = divider && !isLast;

  const wrapStyle = (() => {
    switch (variant) {
      case 'separated': return [styles.itemSeparated, disabled && styles.itemDisabled];
      case 'ghost':     return [styles.itemGhost,     disabled && styles.itemDisabled];
      default:          return [disabled && styles.itemDisabled];
    }
  })();

  const headerBg = (() => {
    if (variant === 'ghost') return 'transparent';
    if (isOpen) {
      if (variant === 'separated' || variant === 'bordered') return colors.bgMuted;
      return colors.bgElevated;
    }
    return 'transparent';
  })();

  // ── Expand icon node ─────────────────────────────────────────────────────
  const expandIndicator = expandIcon
    ? <Animated.View style={{ transform: [{ rotate: chevronAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}>{expandIcon}</Animated.View>
    : <DefaultChevron size={cfg.iconSize} animValue={chevronAnim} />;

  // ── Header ────────────────────────────────────────────────────────────────
  const headerContent = (
    <TouchableOpacity
      onPress={handleToggle}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ expanded: isOpen, disabled }}
      style={[
        styles.header,
        {
          minHeight:       cfg.minHeaderH,
          paddingHorizontal: cfg.ph,
          paddingVertical:   cfg.pv,
          gap:             cfg.gap,
          backgroundColor: headerBg,
        },
        headerStyle,
      ]}
    >
      {/* Left icon when placement = 'left' */}
      {placement === 'left' && expandIndicator}

      {/* Leading slot */}
      {headerLeft != null && (
        <View style={styles.headerLeading}>{headerLeft}</View>
      )}

      {/* Title block */}
      <View style={styles.headerCenter}>
        {typeof title === 'string' ? (
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.headerTitle,
                { fontSize: cfg.fontSize },
                disabled && styles.textDisabled,
              ]}
              numberOfLines={2}
            >
              {title}
            </Text>
            {badge != null && (
              <View style={[styles.badge, { height: cfg.badgeH }]}>
                <Text style={[styles.badgeText, { fontSize: cfg.badgeFs }]}>{badge}</Text>
              </View>
            )}
          </View>
        ) : (
          title
        )}
        {subtitle != null && (
          <Text
            style={[styles.headerSubtitle, { fontSize: cfg.subFontSize }, disabled && styles.textDisabled]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right icon when placement = 'right' (default) */}
      {placement === 'right' && (
        <View style={styles.headerTrailing}>{expandIndicator}</View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[wrapStyle, style]}>
      {/* Header — use renderHeader escape hatch if provided */}
      {renderHeader
        ? renderHeader({ isOpen, toggle: handleToggle, disabled })
        : headerContent}

      {/* Divider below header when open */}
      {isOpen && variant !== 'ghost' && (
        <View style={styles.headerDivider} />
      )}

      {/* Animated content panel */}
      <Animated.View style={[styles.contentClip, { height: heightAnim }]}>
        <View
          onLayout={onContentLayout}
          style={[
            styles.contentInner,
            contentPadding && { padding: cfg.ph },
            contentStyle,
          ]}
        >
          {children}
        </View>
      </Animated.View>

      {/* Divider between items */}
      {showDivider && variant !== 'separated' && variant !== 'ghost' && (
        <View style={styles.divider} />
      )}
    </View>
  );
};

AccordionItem.displayName = 'AccordionItem';

// ─── Accordion (container) ────────────────────────────────────────────────────

export const Accordion: React.FC<AccordionProps> = ({
  children,
  multiple     = false,
  defaultOpen  = [],
  openIds: controlledIds,
  onChange,
  variant      = 'default',
  size         = 'md',
  iconPlacement = 'right',
  icon,
  divider,
  style,
}) => {
  const [internalIds, setInternalIds] = useState<Set<string>>(
    () => new Set(defaultOpen),
  );

  const isControlled = controlledIds !== undefined;
  const openIds: Set<string> = isControlled
    ? new Set(controlledIds)
    : internalIds;

  const toggle = useCallback(
    (id: string) => {
      let next: Set<string>;
      if (openIds.has(id)) {
        next = new Set(openIds);
        next.delete(id);
      } else {
        next = multiple ? new Set(openIds) : new Set<string>();
        next.add(id);
      }
      if (!isControlled) setInternalIds(next);
      onChange?.([...next]);
    },
    [openIds, multiple, isControlled, onChange],
  );

  // Determine IDs from children for isLastItem
  const itemIds: string[] = React.Children.toArray(children)
    .filter(
      (c): c is React.ReactElement<AccordionItemProps> =>
        React.isValidElement(c) && (c.type === AccordionItem),
    )
    .map(c => c.props.id);

  const isLastItem = useCallback(
    (id: string) => itemIds[itemIds.length - 1] === id,
    [itemIds],
  );

  // Show divider by default for contained variants
  const showDivider = divider ?? (variant === 'default' || variant === 'bordered');

  // Container style by variant
  const containerStyle = (() => {
    switch (variant) {
      case 'separated': return [styles.containerSeparated];
      case 'bordered':  return [styles.containerBordered];
      case 'ghost':     return [styles.containerGhost];
      default:          return [styles.containerDefault];
    }
  })();

  return (
    <Ctx.Provider
      value={{ openIds, toggle, variant, size, iconPlacement, icon, divider: showDivider, isLastItem }}
    >
      <View style={[containerStyle, style]}>{children}</View>
    </Ctx.Provider>
  );
};

Accordion.displayName = 'Accordion';

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Containers ──────────────────────────────────────────────────────────
  containerDefault: {
    borderRadius:    radii.xl,
    borderWidth:     1,
    borderColor:     colors.border,
    backgroundColor: colors.bgElevated,
    overflow:        'hidden',
  },
  containerBordered: {
    borderRadius:    radii.xl,
    borderWidth:     1.5,
    borderColor:     colors.borderStrong,
    backgroundColor: colors.bgElevated,
    overflow:        'hidden',
  },
  containerSeparated: {
    gap: spacing[2],
  },
  containerGhost: {
    gap: spacing[1],
  },

  // ── Items ────────────────────────────────────────────────────────────────
  itemSeparated: {
    borderRadius:    radii.xl,
    borderWidth:     1,
    borderColor:     colors.border,
    backgroundColor: colors.bgElevated,
    overflow:        'hidden',
  },
  itemGhost: {
    borderRadius:    radii.lg,
    overflow:        'hidden',
  },
  itemDisabled: {
    opacity: 0.45,
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    flexDirection:  'row',
    alignItems:     'center',
  },
  headerLeading: {
    marginRight: spacing[1],
  },
  headerCenter: {
    flex: 1,
    gap:  2,
  },
  headerTrailing: {
    marginLeft:     spacing[2],
    width:          24,
    height:         24,
    alignItems:     'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing[2],
  },
  headerTitle: {
    color:              colors.textPrimary,
    fontWeight:         typography.fontWeight.medium,
    includeFontPadding: false,
    flex:               1,
  },
  headerSubtitle: {
    color:              colors.textSecondary,
    fontWeight:         typography.fontWeight.regular,
    includeFontPadding: false,
  },
  textDisabled: {
    color: colors.textTertiary,
  },

  // ── Badge ────────────────────────────────────────────────────────────────
  badge: {
    paddingHorizontal: spacing[2],
    borderRadius:      radii.full,
    backgroundColor:   'rgba(109,40,217,0.18)',
    borderWidth:       1,
    borderColor:       colors.violet600,
    alignItems:        'center',
    justifyContent:    'center',
  },
  badgeText: {
    color:      colors.violet300,
    fontWeight: typography.fontWeight.semibold,
  },

  // ── Dividers ─────────────────────────────────────────────────────────────
  headerDivider: {
    height:          1,
    backgroundColor: colors.border,
  },
  divider: {
    height:          1,
    backgroundColor: colors.border,
  },

  // ── Content ──────────────────────────────────────────────────────────────
  contentClip: {
    overflow: 'hidden',
  },
  contentInner: {
    // position must NOT be absolute here; let it flow so onLayout gives real height
  },
});
