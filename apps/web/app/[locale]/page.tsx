'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../auth-context';
import { useParams, useRouter } from 'next/navigation';

export default function LocaleHomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    if (!isLoading && user) {
      router.push(`/${locale}/dashboard`);
    }
  }, [user, isLoading, locale, router]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '480px', textAlign: 'center' }}>
        <h2>Chạm Nhật Bản</h2>
        <p className="subtitle" style={{ marginBottom: '24px' }}>
          Học tiếng Nhật N5 theo lộ trình trực quan và theo dõi streak của bạn hàng ngày.
        </p>

        <div className="auth-form" style={{ marginTop: '20px' }}>
          <button
            onClick={() => router.push(`/${locale}/login`)}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            Đăng nhập
          </button>

          <button
            onClick={() => router.push(`/${locale}/register`)}
            className="btn-secondary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: '600' }}
          >
            Tạo tài khoản mới
          </button>
        </div>

        <p className="auth-footer" style={{ marginTop: '30px', fontSize: '12px' }}>
          Bắt đầu hành trình chinh phục N5 của bạn ngay hôm nay!
        </p>
      </div>
    </div>
  );
}
