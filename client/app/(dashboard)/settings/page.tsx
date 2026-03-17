'use client';

import { useUser } from '@clerk/nextjs';
import {
  User,
  Mail,
  Shield,
  Bell,
  Palette,
  Database
} from 'lucide-react';

export default function SettingsPage() {
  const { user, isLoaded } = useUser();

  const settingsSections = [
    {
      icon: User,
      title: 'Profile',
      description: 'Manage your personal information',
      items: [
        { label: 'Full Name', value: user?.fullName || 'Not set' },
        { label: 'Username', value: user?.username || 'Not set' },
      ]
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Manage your email addresses',
      items: [
        { label: 'Primary Email', value: user?.primaryEmailAddress?.emailAddress || 'Not set' },
      ]
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Password and authentication settings',
      items: [
        { label: 'Two-Factor Auth', value: 'Not enabled' },
        { label: 'Password', value: '••••••••' },
      ]
    },
    {
      icon: Database,
      title: 'Data',
      description: 'Manage your notebooks and data',
      items: [
        { label: 'Notebooks', value: '2 notebooks' },
        { label: 'Storage Used', value: '45 MB' },
      ]
    },
  ];

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '32px',
      maxWidth: '800px',
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 600,
        color: 'var(--text-primary)',
        margin: '0 0 8px',
        letterSpacing: '-0.5px',
      }}>
        Settings
      </h1>
      <p style={{
        fontSize: '14px',
        color: 'var(--text-secondary)',
        margin: '0 0 32px',
      }}>
        Manage your account settings and preferences
      </p>

      {isLoaded ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {settingsSections.map((section) => (
            <div
              key={section.title}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
              }}
            >
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--accent-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <section.icon size={20} color="var(--accent)" />
                </div>
                <div>
                  <h2 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: '0 0 2px',
                  }}>
                    {section.title}
                  </h2>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    margin: 0,
                  }}>
                    {section.description}
                  </p>
                </div>
              </div>

              <div>
                {section.items.map((item, index) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 24px',
                      borderBottom: index < section.items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    }}
                  >
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                    }}>
                      {item.label}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      fontWeight: 500,
                    }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              height: '180px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}