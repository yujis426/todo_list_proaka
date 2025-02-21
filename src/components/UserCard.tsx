// 基本的な型定義
type User = {
    id: number;
    name: string;
    email: string;
    age?: number; // ?は省略可能なプロパティを表す
  }
  
  // Propsの型定義
  interface UserCardProps {
    user: User;
    onEdit: (id: number) => void;
    isSelected?: boolean;
  }
  
  // コンポーネントに型を指定
  function UserCard({ user, onEdit, isSelected = false }: UserCardProps) {
    return (
      <div className={`user-card ${isSelected ? 'selected' : ''}`}>
        <h3>{user.name}</h3>
        <p>Email: {user.email}</p>
        {/* 省略可能な値の安全な表示 */}
        {user.age && <p>Age: {user.age}</p>}
        <button onClick={() => onEdit(user.id)}>編集</button>
      </div>
    );
  }
  
  export default UserCard;