import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '../../tokens';

export type TabsVariant = 'line' | 'pill' | 'enclosed';

export interface TabItem {
  id:        string;
  label:     string;
  badge?:    string | number;
  disabled?: boolean;
}

interface TabsCtxValue {
  active:    string;
  setActive: (id: string) => void;
  variant:   TabsVariant;
}

const TabsCtx = createContext<TabsCtxValue>({ active: '', setActive: () => undefined, variant: 'line' });

export interface TabsProps {
  items:       TabItem[];
  defaultTab?: string;
  active?:     string;
  onChange?:   (id: string) => void;
  variant?:    TabsVariant;
  style?:      ViewStyle;
  children?:   React.ReactNode;
}

const trackStyle: Record<TabsVariant, ViewStyle> = {
  line:     { borderBottomWidth: 1, borderBottomColor: colors.border },
  pill:     { backgroundColor: colors.bgMuted, borderRadius: radii.xl, borderWidth: 1, borderColor: colors.borderSubtle, padding: 4 },
  enclosed: { backgroundColor: colors.bgElevated, borderRadius: radii.xl, borderWidth: 1, borderColor: colors.border, padding: 4 },
};

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTab,
  active: controlledActive,
  onChange,
  variant  = 'line',
  style,
  children,
}) => {
  const [internalActive, setInternalActive] = useState(defaultTab ?? items[0]?.id ?? '');
  const active    = controlledActive ?? internalActive;
  const setActive = (id: string) => { setInternalActive(id); onChange?.(id); };

  return (
    <TabsCtx.Provider value={{ active, setActive, variant }}>
      <View style={[styles.wrapper, style]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.track, trackStyle[variant]]}
        >
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <TabButton key={item.id} item={item} isActive={isActive} />
            );
          })}
        </ScrollView>
        {children}
      </View>
    </TabsCtx.Provider>
  );
};

const TabButton: React.FC<{ item: TabItem; isActive: boolean }> = ({ item, isActive }) => {
  const { setActive, variant } = useContext(TabsCtx);

  const activeTabStyle: Record<TabsVariant, ViewStyle> = {
    line:     { borderBottomWidth: 2, borderBottomColor: colors.violet500, marginBottom: -1 },
    pill:     { backgroundColor: 'rgba(124,58,237,0.15)', borderRadius: radii.lg, borderWidth: 1, borderColor: 'rgba(109,40,217,0.4)' },
    enclosed: { backgroundColor: colors.bgOverlay, borderRadius: radii.md, borderWidth: 1, borderColor: colors.borderStrong },
  };

  return (
    <TouchableOpacity
      onPress={() => !item.disabled && setActive(item.id)}
      disabled={item.disabled}
      activeOpacity={0.7}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive, disabled: item.disabled }}
      style={[
        styles.tab,
        isActive && activeTabStyle[variant],
        item.disabled && styles.tabDisabled,
      ]}
    >
      <Text
        style={[
          styles.tabLabel,
          { color: isActive ? colors.textPrimary : colors.textTertiary },
          isActive && variant !== 'line' && { color: colors.violet200 },
        ]}
        numberOfLines={1}
      >
        {item.label}
      </Text>
      {item.badge != null && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const TabPanel: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { active } = useContext(TabsCtx);
  if (active !== id) return null;
  return <View style={styles.panel}>{children}</View>;
};

const styles = StyleSheet.create({
  wrapper: { gap: 0 },
  track: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           2,
  },
  tab: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            6,
    paddingHorizontal: spacing[3],
    paddingVertical:   spacing[2],
  },
  tabLabel: {
    fontSize:           14,
    fontWeight:         typography.fontWeight.medium,
    includeFontPadding: false,
    whiteSpace:         'nowrap',
  },
  tabDisabled: { opacity: 0.4 },
  badge: {
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderRadius:    radii.full,
    minWidth:        18,
    height:          18,
    paddingHorizontal: 4,
    alignItems:      'center',
    justifyContent:  'center',
  },
  badgeText: {
    fontSize:           11,
    fontWeight:         typography.fontWeight.semibold,
    color:              colors.violet300,
    includeFontPadding: false,
  },
  panel: {
    paddingTop: spacing[4],
  },
});
