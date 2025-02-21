import React, { useState, useEffect } from 'react';

interface UserListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number; // インデックスを追加
  isLoading?: boolean;
  errorMessage?: string;
}

function UserList<T>({
  items,
  renderItem,
  keyExtractor,
  isLoading = false,
  errorMessage = '',
}: UserListProps<T>) {
  if (isLoading) {
    return <p>データを読み込み中です...</p>;
  }

  if (errorMessage) {
    return <p className="error">{errorMessage}</p>;
  }

  if (items.length === 0) {
    return <p>データがありません</p>;
  }

  return (
    <div className="data-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {items.map((item, index) => (
        <div key={keyExtractor(item, index)} className="list-item">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

export default UserList;