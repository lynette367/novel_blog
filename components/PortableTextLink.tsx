import React from 'react';

interface PortableTextLinkProps {
  href: string;
  children: React.ReactNode;
}

export function PortableTextLink({ href, children }: PortableTextLinkProps) {
  // 检查是否为外部链接
  const isExternal = href.startsWith('http://') || href.startsWith('https://');
  
  // 检查是否为内部链接（以 / 开头）
  const isInternal = href.startsWith('/');
  
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer nofollow' : undefined}
      className="text-blue-600 hover:underline"
    >
      {children}
    </a>
  );
}