import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Accordion, AccordionItem } from './Accordion';
import { colors, spacing, typography, radii } from '../../tokens';

// ─── Sample icons (inline, no deps) ──────────────────────────────────────────

const InfoIcon = () => (
  <View style={icon.wrap}>
    <View style={icon.circle}>
      <Text style={icon.letter}>i</Text>
    </View>
  </View>
);

const ShieldIcon = () => (
  <View style={[icon.wrap, { backgroundColor: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.3)' }]}>
    <Text style={[icon.letter, { color: colors.success, fontSize: 12 }]}>✦</Text>
  </View>
);

const BellIcon = () => (
  <View style={[icon.wrap, { backgroundColor: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.3)' }]}>
    <Text style={[icon.letter, { color: colors.warning, fontSize: 12 }]}>◉</Text>
  </View>
);

const StarIcon = () => (
  <View style={[icon.wrap, { backgroundColor: 'rgba(124,58,237,0.15)', borderColor: colors.violet600 }]}>
    <Text style={[icon.letter, { color: colors.violet300, fontSize: 11 }]}>★</Text>
  </View>
);

const PlusIcon = () => (
  <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ position: 'absolute', width: 14, height: 1.5, backgroundColor: colors.violet400, borderRadius: 1 }} />
    <View style={{ position: 'absolute', width: 1.5, height: 14, backgroundColor: colors.violet400, borderRadius: 1 }} />
  </View>
);

const icon = StyleSheet.create({
  wrap: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderWidth: 1, borderColor: colors.violet600,
    alignItems: 'center', justifyContent: 'center',
  },
  circle: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.violet500,
    alignItems: 'center', justifyContent: 'center',
  },
  letter: {
    fontSize: 10, fontWeight: '700' as const,
    color: '#fff', includeFontPadding: false,
    lineHeight: 14,
  },
});

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={s.section}>
    <Text style={s.sectionLabel}>{title}</Text>
    {children}
  </View>
);

const BodyText: React.FC<{ children: string }> = ({ children }) => (
  <Text style={s.bodyText}>{children}</Text>
);

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  decorators: [
    Story => (
      <ScrollView style={s.screen} contentContainerStyle={s.container}>
        <Story />
      </ScrollView>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// ─── 1. Default variant ───────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Section title="Default">
      <Accordion>
        <AccordionItem id="a" title="What is Neo Design System?">
          <BodyText>
            Neo is a dark-mode-first design system built on a Black & Violet palette.
            It ships React and React Native components that share a common token layer.
          </BodyText>
        </AccordionItem>
        <AccordionItem id="b" title="How do I install it?">
          <BodyText>
            Run `npm install @neo-design-library/mobile` then import any component
            from the package root. No extra peer config required for Expo projects.
          </BodyText>
        </AccordionItem>
        <AccordionItem id="c" title="Is it production-ready?">
          <BodyText>
            Yes — Neo is actively used in production and follows WCAG AA accessibility
            standards across all components.
          </BodyText>
        </AccordionItem>
      </Accordion>
    </Section>
  ),
};

// ─── 2. Variants ─────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <>
      <Section title="default">
        <Accordion variant="default">
          <AccordionItem id="a" title="Contained, shared border">
            <BodyText>Items share the container's border-radius and border. A divider separates them.</BodyText>
          </AccordionItem>
          <AccordionItem id="b" title="Second item">
            <BodyText>Content here.</BodyText>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="separated">
        <Accordion variant="separated">
          <AccordionItem id="a" title="Each item is a card">
            <BodyText>Items stand alone with their own border and border-radius.</BodyText>
          </AccordionItem>
          <AccordionItem id="b" title="Independent cards">
            <BodyText>Content here.</BodyText>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="bordered">
        <Accordion variant="bordered">
          <AccordionItem id="a" title="Heavier border weight">
            <BodyText>Same as default but with a 1.5px accent border for extra emphasis.</BodyText>
          </AccordionItem>
          <AccordionItem id="b" title="Second item">
            <BodyText>Content here.</BodyText>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="ghost">
        <Accordion variant="ghost">
          <AccordionItem id="a" title="No background, no border">
            <BodyText>Ghost items have zero chrome — useful inside cards or drawers.</BodyText>
          </AccordionItem>
          <AccordionItem id="b" title="Minimal chrome">
            <BodyText>Content here.</BodyText>
          </AccordionItem>
        </Accordion>
      </Section>
    </>
  ),
};

// ─── 3. Sizes ─────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <>
      {(['sm', 'md', 'lg'] as const).map(size => (
        <Section key={size} title={`size="${size}"`}>
          <Accordion size={size}>
            <AccordionItem id="1" title="Header text scales with size">
              <BodyText>The header height, font size, padding, and icon scale together.</BodyText>
            </AccordionItem>
            <AccordionItem id="2" title="Second item">
              <BodyText>Content.</BodyText>
            </AccordionItem>
          </Accordion>
        </Section>
      ))}
    </>
  ),
};

// ─── 4. Icon placement ────────────────────────────────────────────────────────

export const IconPlacement: Story = {
  render: () => (
    <>
      <Section title='iconPlacement="right" (default)'>
        <Accordion iconPlacement="right">
          <AccordionItem id="a" title="Chevron on the right">
            <BodyText>Standard placement — chevron trails the title.</BodyText>
          </AccordionItem>
          <AccordionItem id="b" title="Second item">
            <BodyText>Content.</BodyText>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title='iconPlacement="left"'>
        <Accordion iconPlacement="left">
          <AccordionItem id="a" title="Chevron on the left">
            <BodyText>Icon leads — useful for outline-style FAQs.</BodyText>
          </AccordionItem>
          <AccordionItem id="b" title="Second item">
            <BodyText>Content.</BodyText>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title='iconPlacement="none"'>
        <Accordion iconPlacement="none">
          <AccordionItem id="a" title="No expand indicator">
            <BodyText>Tap the header — there's no visual cue beyond the open state.</BodyText>
          </AccordionItem>
          <AccordionItem id="b" title="Second item">
            <BodyText>Content.</BodyText>
          </AccordionItem>
        </Accordion>
      </Section>
    </>
  ),
};

// ─── 5. Custom icon ───────────────────────────────────────────────────────────

export const CustomIcon: Story = {
  render: () => (
    <>
      <Section title="Custom icon: +/− per-Accordion">
        {/* Single custom icon applied to all items */}
        <Accordion icon={<PlusIcon />}>
          <AccordionItem id="a" title="Uses the parent's custom icon">
            <BodyText>All items inherit the + icon (it rotates 180° on open).</BodyText>
          </AccordionItem>
          <AccordionItem id="b" title="Second item">
            <BodyText>Content.</BodyText>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Custom icon per-item">
        <Accordion>
          <AccordionItem id="a" title="Default chevron" >
            <BodyText>No icon override — uses the default chevron.</BodyText>
          </AccordionItem>
          <AccordionItem id="b" title="Custom + icon" icon={<PlusIcon />}>
            <BodyText>This item swaps to the + icon.</BodyText>
          </AccordionItem>
          <AccordionItem id="c" title="Custom Star icon" icon={<StarIcon />}>
            <BodyText>This item uses a star icon (also rotates on open).</BodyText>
          </AccordionItem>
        </Accordion>
      </Section>
    </>
  ),
};

// ─── 6. headerLeft slot ───────────────────────────────────────────────────────

export const HeaderLeftSlot: Story = {
  render: () => (
    <Section title="headerLeft — leading icon/avatar">
      <Accordion variant="separated">
        <AccordionItem id="a" title="Account & Privacy" subtitle="Manage your credentials" headerLeft={<InfoIcon />} badge="2">
          <BodyText>Update your email, password, and two-factor authentication settings here.</BodyText>
        </AccordionItem>
        <AccordionItem id="b" title="Security" subtitle="Audit & permissions" headerLeft={<ShieldIcon />}>
          <BodyText>Review active sessions and revoke access for trusted devices.</BodyText>
        </AccordionItem>
        <AccordionItem id="c" title="Notifications" subtitle="Alerts & digests" headerLeft={<BellIcon />} badge="new">
          <BodyText>Customise which events trigger push notifications and email digests.</BodyText>
        </AccordionItem>
      </Accordion>
    </Section>
  ),
};

// ─── 7. Subtitle & badge ──────────────────────────────────────────────────────

export const SubtitleAndBadge: Story = {
  render: () => (
    <Section title="subtitle + badge">
      <Accordion>
        <AccordionItem id="a" title="Billing" subtitle="Manage plan & invoices" badge={3}>
          <BodyText>3 unpaid invoices are awaiting your review.</BodyText>
        </AccordionItem>
        <AccordionItem id="b" title="Team Members" subtitle="Invite and manage access" badge="pro">
          <BodyText>Pro plan allows unlimited team members.</BodyText>
        </AccordionItem>
        <AccordionItem id="c" title="Integrations" subtitle="Connected services">
          <BodyText>View all active integrations and their status.</BodyText>
        </AccordionItem>
      </Accordion>
    </Section>
  ),
};

// ─── 8. Multiple open ─────────────────────────────────────────────────────────

export const MultipleOpen: Story = {
  render: () => (
    <Section title="multiple — many panels open at once">
      <Accordion multiple>
        <AccordionItem id="a" title="Panel A — click all to expand">
          <BodyText>Multiple panels can be open simultaneously. No accordion collapse.</BodyText>
        </AccordionItem>
        <AccordionItem id="b" title="Panel B">
          <BodyText>Still open even when C is expanded.</BodyText>
        </AccordionItem>
        <AccordionItem id="c" title="Panel C">
          <BodyText>Independent of A and B.</BodyText>
        </AccordionItem>
      </Accordion>
    </Section>
  ),
};

// ─── 9. Default open ─────────────────────────────────────────────────────────

export const DefaultOpen: Story = {
  render: () => (
    <>
      <Section title="defaultOpen on Accordion">
        <Accordion defaultOpen={['b']}>
          <AccordionItem id="a" title="Starts closed">
            <BodyText>This panel begins collapsed.</BodyText>
          </AccordionItem>
          <AccordionItem id="b" title="Starts open (defaultOpen)">
            <BodyText>Panel B is open on first render via Accordion defaultOpen prop.</BodyText>
          </AccordionItem>
          <AccordionItem id="c" title="Starts closed">
            <BodyText>This panel begins collapsed.</BodyText>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="defaultOpen on AccordionItem">
        <Accordion>
          <AccordionItem id="a" title="Starts closed">
            <BodyText>This panel begins collapsed.</BodyText>
          </AccordionItem>
          <AccordionItem id="b" title="Starts open (item defaultOpen)" defaultOpen>
            <BodyText>This item carries its own defaultOpen=true.</BodyText>
          </AccordionItem>
        </Accordion>
      </Section>
    </>
  ),
};

// ─── 10. Controlled ──────────────────────────────────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [openIds, setOpenIds] = useState<string[]>(['a']);
    return (
      <Section title={`Controlled — open: [${openIds.join(', ')}]`}>
        <View style={{ flexDirection: 'row', gap: spacing[2], marginBottom: spacing[3], flexWrap: 'wrap' }}>
          {['a', 'b', 'c'].map(id => (
            <View
              key={id}
              style={{
                paddingHorizontal: spacing[3], paddingVertical: spacing[1],
                borderRadius: radii.full,
                backgroundColor: openIds.includes(id) ? 'rgba(124,58,237,0.2)' : colors.bgMuted,
                borderWidth: 1,
                borderColor: openIds.includes(id) ? colors.violet500 : colors.border,
              }}
            >
              <Text
                style={{ fontSize: 12, color: openIds.includes(id) ? colors.violet300 : colors.textSecondary }}
                onPress={() =>
                  setOpenIds(prev =>
                    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
                  )
                }
              >
                Toggle {id.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
        <Accordion multiple openIds={openIds} onChange={setOpenIds}>
          <AccordionItem id="a" title="Panel A">
            <BodyText>Controlled by external state.</BodyText>
          </AccordionItem>
          <AccordionItem id="b" title="Panel B">
            <BodyText>Use the toggle buttons above to control which panels are open.</BodyText>
          </AccordionItem>
          <AccordionItem id="c" title="Panel C">
            <BodyText>This panel is also externally controlled.</BodyText>
          </AccordionItem>
        </Accordion>
      </Section>
    );
  },
};

// ─── 11. Disabled ────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <Section title="Disabled items">
      <Accordion>
        <AccordionItem id="a" title="Available">
          <BodyText>This item is interactive.</BodyText>
        </AccordionItem>
        <AccordionItem id="b" title="Disabled — cannot expand" disabled>
          <BodyText>You should not be able to read this.</BodyText>
        </AccordionItem>
        <AccordionItem id="c" title="Available">
          <BodyText>Also interactive.</BodyText>
        </AccordionItem>
      </Accordion>
    </Section>
  ),
};

// ─── 12. renderHeader escape hatch ───────────────────────────────────────────

export const RenderHeader: Story = {
  render: () => (
    <Section title="renderHeader — fully custom header">
      <Accordion variant="separated">
        <AccordionItem
          id="a"
          title="Ignored when renderHeader is set"
          renderHeader={({ isOpen, toggle }) => (
            <View
              style={{
                flexDirection: 'row', alignItems: 'center',
                padding: spacing[4], gap: spacing[3],
                backgroundColor: isOpen ? 'rgba(124,58,237,0.1)' : 'transparent',
              }}
            >
              <View style={{
                width: 36, height: 36, borderRadius: radii.lg,
                backgroundColor: isOpen ? colors.violet500 : colors.bgMuted,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 16 }}>{isOpen ? '▲' : '▼'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600' as const, color: isOpen ? colors.violet300 : colors.textPrimary }}>
                  Custom Rendered Header
                </Text>
                <Text style={{ fontSize: 12, color: colors.textTertiary, marginTop: 2 }}>
                  {isOpen ? 'Tap to collapse' : 'Tap to expand'}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 13, color: colors.violet400,
                  fontWeight: '500' as const,
                }}
                onPress={toggle}
              >
                {isOpen ? 'Hide' : 'Show'}
              </Text>
            </View>
          )}
        >
          <View style={{ padding: spacing[4], gap: spacing[2] }}>
            <Text style={{ color: colors.textPrimary, fontSize: 14 }}>
              The entire header row is yours. You receive
              {' '}<Text style={{ color: colors.violet300 }}>isOpen</Text> and
              {' '}<Text style={{ color: colors.violet300 }}>toggle()</Text>
              {' '}— the content area is still animated by the Accordion.
            </Text>
          </View>
        </AccordionItem>

        <AccordionItem
          id="b"
          title="Normal item for comparison"
          subtitle="Uses default header"
        >
          <BodyText>This item uses the standard header layout.</BodyText>
        </AccordionItem>
      </Accordion>
    </Section>
  ),
};

// ─── 13. Rich content ────────────────────────────────────────────────────────

export const RichContent: Story = {
  render: () => (
    <Section title="Rich content inside panels">
      <Accordion variant="separated">
        <AccordionItem id="pricing" title="Pricing plans" headerLeft={<StarIcon />} badge="3">
          <View style={{ gap: spacing[3] }}>
            {[
              { name: 'Starter', price: '$0', desc: 'Up to 3 projects' },
              { name: 'Pro',     price: '$12/mo', desc: 'Unlimited projects' },
              { name: 'Team',    price: '$49/mo', desc: 'Collaborative workspace' },
            ].map(p => (
              <View key={p.name} style={s.planRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.planName}>{p.name}</Text>
                  <Text style={s.planDesc}>{p.desc}</Text>
                </View>
                <Text style={s.planPrice}>{p.price}</Text>
              </View>
            ))}
          </View>
        </AccordionItem>

        <AccordionItem id="faq" title="Frequently asked questions" headerLeft={<InfoIcon />}>
          <View style={{ gap: spacing[4] }}>
            {[
              { q: 'Can I change plans later?', a: 'Yes — upgrade or downgrade at any time from billing settings.' },
              { q: 'Is there a free trial?',    a: 'Pro has a 14-day trial, no credit card required.' },
            ].map((item, i) => (
              <View key={i} style={{ gap: spacing[1] }}>
                <Text style={{ fontSize: 14, fontWeight: '600' as const, color: colors.textPrimary }}>{item.q}</Text>
                <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>{item.a}</Text>
              </View>
            ))}
          </View>
        </AccordionItem>
      </Accordion>
    </Section>
  ),
};

// ─── 14. No content padding ───────────────────────────────────────────────────

export const NoPadding: Story = {
  render: () => (
    <Section title="contentPadding={false} — full-bleed content">
      <Accordion>
        <AccordionItem id="a" title="Full-bleed image slot" contentPadding={false}>
          <View style={{ height: 120, backgroundColor: colors.bgMuted, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.textTertiary, fontSize: 13 }}>image / map / chart goes here edge-to-edge</Text>
          </View>
        </AccordionItem>
        <AccordionItem id="b" title="Normal padding for comparison">
          <BodyText>This item uses the default padding.</BodyText>
        </AccordionItem>
      </Accordion>
    </Section>
  ),
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: colors.bgBase },
  container: { padding: spacing[6], gap: spacing[8], paddingBottom: spacing[16] },
  section:   { gap: spacing[3] },
  sectionLabel: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  bodyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  planName:  { fontSize: 14, fontWeight: '600' as const, color: colors.textPrimary },
  planDesc:  { fontSize: 12, color: colors.textTertiary, marginTop: 1 },
  planPrice: { fontSize: 15, fontWeight: '700' as const, color: colors.violet300 },
});
