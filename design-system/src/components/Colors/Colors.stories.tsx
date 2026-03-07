import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta: Meta = {
  title: 'Foundation/Colors',
  tags:  ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

// ─── Swatch ───────────────────────────────────────────────────

const Swatch = ({ name, value, cssVar }: { name: string; value: string; cssVar?: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(cssVar ?? value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const isDark = isColorDark(value);

  return (
    <button
      onClick={copy}
      title={`Click to copy ${cssVar ?? value}`}
      style={{
        display: 'flex', flexDirection: 'column', gap: 6,
        background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left',
      }}
    >
      <div style={{
        width: '100%', aspectRatio: '1', borderRadius: 10,
        background: value,
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.625rem', fontWeight: 600,
        color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
      }}>
        {copied ? '✓ Copied' : ''}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{name}</p>
        <p style={{ margin: 0, fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{value}</p>
        {cssVar && <p style={{ margin: 0, fontSize: '0.6875rem', color: 'var(--violet-300)', fontFamily: 'var(--font-mono)' }}>{cssVar}</p>}
      </div>
    </button>
  );
};

function isColorDark(hex: string) {
  const c = hex.replace('#','');
  if (c.length < 6) return true;
  const r = parseInt(c.slice(0,2),16), g = parseInt(c.slice(2,4),16), b = parseInt(c.slice(4,6),16);
  return (0.299*r + 0.587*g + 0.114*b) < 128;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 48 }}>
    <p style={{ margin: '0 0 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 16 }}>
      {children}
    </div>
  </div>
);

// ─── Stories ──────────────────────────────────────────────────

export const Palette: Story = {
  name: 'Color Palette',
  render: () => (
    <div style={{ padding: 40, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ margin: '0 0 8px', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Color System</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Click any swatch to copy the CSS variable. Black &amp; violet palette for dark-mode SaaS.</p>
      </div>

      <Section title="Violet — Primary Brand">
        {[
          { name:'50',  val:'#EDE9FE', css:'--violet-50'  },
          { name:'100', val:'#DDD6FE', css:'--violet-100' },
          { name:'200', val:'#C4B5FD', css:'--violet-200' },
          { name:'300', val:'#A78BFA', css:'--violet-300' },
          { name:'400', val:'#8B5CF6', css:'--violet-400' },
          { name:'500', val:'#7C3AED', css:'--violet-500' },
          { name:'600', val:'#6D28D9', css:'--violet-600' },
          { name:'700', val:'#5B21B6', css:'--violet-700' },
          { name:'800', val:'#4C1D95', css:'--violet-800' },
          { name:'900', val:'#2E0D6E', css:'--violet-900' },
          { name:'950', val:'#1A0640', css:'--violet-950' },
        ].map(s => <Swatch key={s.name} name={s.name} value={s.val} cssVar={s.css} />)}
      </Section>

      <Section title="Backgrounds">
        {[
          { name:'Base',     val:'#000000', css:'--bg-base'     },
          { name:'Subtle',   val:'#08080F', css:'--bg-subtle'   },
          { name:'Elevated', val:'#0F0F1A', css:'--bg-elevated' },
          { name:'Overlay',  val:'#13131F', css:'--bg-overlay'  },
          { name:'Muted',    val:'#1A1A2E', css:'--bg-muted'    },
        ].map(s => <Swatch key={s.name} name={s.name} value={s.val} cssVar={s.css} />)}
      </Section>

      <Section title="Neutrals">
        {[
          { name:'900', val:'#16162A', css:'--neutral-900' },
          { name:'800', val:'#1E1E35', css:'--neutral-800' },
          { name:'700', val:'#2C2C4A', css:'--neutral-700' },
          { name:'600', val:'#3D3D5C', css:'--neutral-600' },
          { name:'500', val:'#55556E', css:'--neutral-500' },
          { name:'400', val:'#6B6B8A', css:'--neutral-400' },
          { name:'300', val:'#9898B3', css:'--neutral-300' },
          { name:'200', val:'#C5C5D8', css:'--neutral-200' },
          { name:'100', val:'#E2E2EE', css:'--neutral-100' },
          { name:'50',  val:'#F0F0F8', css:'--neutral-50'  },
        ].map(s => <Swatch key={s.name} name={s.name} value={s.val} cssVar={s.css} />)}
      </Section>

      <Section title="Semantic">
        {[
          { name:'Success',    val:'#10B981', css:'--success'    },
          { name:'Success Lt', val:'#34D399', css:'--success-lt' },
          { name:'Success Bg', val:'#0A2A1F', css:'--success-bg' },
          { name:'Warning',    val:'#F59E0B', css:'--warning'    },
          { name:'Warning Lt', val:'#FCD34D', css:'--warning-lt' },
          { name:'Warning Bg', val:'#2A1F06', css:'--warning-bg' },
          { name:'Error',      val:'#EF4444', css:'--error'      },
          { name:'Error Lt',   val:'#F87171', css:'--error-lt'   },
          { name:'Error Bg',   val:'#2A0A0A', css:'--error-bg'   },
          { name:'Info',       val:'#06B6D4', css:'--info'       },
          { name:'Info Lt',    val:'#22D3EE', css:'--info-lt'    },
          { name:'Info Bg',    val:'#041F26', css:'--info-bg'    },
        ].map(s => <Swatch key={s.name} name={s.name} value={s.val} cssVar={s.css} />)}
      </Section>

      <Section title="Text">
        {[
          { name:'Primary',   val:'#F0F0F8', css:'--text-primary'   },
          { name:'Secondary', val:'#9898B3', css:'--text-secondary'  },
          { name:'Tertiary',  val:'#6B6B8A', css:'--text-tertiary'   },
          { name:'Disabled',  val:'#3D3D5C', css:'--text-disabled'   },
          { name:'Brand',     val:'#A78BFA', css:'--text-brand'      },
        ].map(s => <Swatch key={s.name} name={s.name} value={s.val} cssVar={s.css} />)}
      </Section>

      <Section title="Borders">
        {[
          { name:'Default', val:'#2C2C4A', css:'--border'        },
          { name:'Subtle',  val:'#1E1E35', css:'--border-subtle'  },
          { name:'Strong',  val:'#3D3D5C', css:'--border-strong'  },
          { name:'Brand',   val:'#6D28D9', css:'--border-brand'   },
          { name:'Focus',   val:'#8B5CF6', css:'--border-focus'   },
        ].map(s => <Swatch key={s.name} name={s.name} value={s.val} cssVar={s.css} />)}
      </Section>
    </div>
  ),
};

export const Gradients: Story = {
  name: 'Gradients',
  render: () => (
    <div style={{ padding: 40 }}>
      <p style={{ margin: '0 0 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Gradient Utilities</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { name: 'gradient-brand',        bg: 'linear-gradient(135deg,#6D28D9,#8B5CF6)',                    label: '.gradient-brand' },
          { name: 'gradient-brand-subtle', bg: 'linear-gradient(135deg,rgba(109,40,217,0.15),rgba(139,92,246,0.05))', label: '.gradient-brand-subtle' },
          { name: 'gradient-surface',      bg: 'linear-gradient(180deg,#0F0F1A,#08080F)',                    label: '.gradient-surface' },
          { name: 'violet-glow',           bg: 'radial-gradient(circle at 50% 50%,rgba(124,58,237,0.4),transparent 70%)', label: 'Violet glow' },
          { name: 'multi-stop',            bg: 'linear-gradient(135deg,#1A0640,#6D28D9,#A78BFA)',            label: 'Multi-stop' },
          { name: 'brand-to-cyan',         bg: 'linear-gradient(135deg,#7C3AED,#06B6D4)',                    label: 'Brand → Cyan' },
        ].map(g => (
          <div key={g.name}>
            <div style={{ height: 80, borderRadius: 12, background: g.bg, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }} />
            <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>{g.name}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--violet-300)' }}>{g.label}</p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Shadows: Story = {
  name: 'Shadows & Glows',
  render: () => (
    <div style={{ padding: 40 }}>
      <p style={{ margin: '0 0 24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Shadow Tokens</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {[
          { name: 'shadow-sm',       shadow: '0 1px 3px 0 rgba(0,0,0,0.6)',                     css: '--shadow-sm'       },
          { name: 'shadow-md',       shadow: '0 4px 6px -1px rgba(0,0,0,0.6)',                  css: '--shadow-md'       },
          { name: 'shadow-lg',       shadow: '0 10px 15px -3px rgba(0,0,0,0.7)',                css: '--shadow-lg'       },
          { name: 'shadow-xl',       shadow: '0 20px 25px -5px rgba(0,0,0,0.8)',                css: '--shadow-xl'       },
          { name: 'shadow-card',     shadow: '0 1px 0 0 rgba(44,44,74,0.8),0 4px 12px rgba(0,0,0,0.5)', css:'--shadow-card' },
          { name: 'glow-sm',         shadow: '0 0 12px rgba(124,58,237,0.4)',                   css: '--shadow-glow-sm'  },
          { name: 'glow-md',         shadow: '0 0 20px rgba(124,58,237,0.5)',                   css: '--shadow-glow-md'  },
          { name: 'glow-lg',         shadow: '0 0 40px rgba(124,58,237,0.6)',                   css: '--shadow-glow-lg'  },
          { name: 'card-hover',      shadow: '0 1px 0 0 rgba(109,40,217,0.5),0 8px 24px rgba(0,0,0,0.6),0 0 0 1px rgba(109,40,217,0.2)', css:'--shadow-card-hover' },
        ].map(s => (
          <div key={s.name} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 100, height: 100, borderRadius: 12,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              boxShadow: s.shadow,
            }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{s.name}</p>
              <p style={{ margin: 0, fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--violet-300)' }}>{s.css}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
