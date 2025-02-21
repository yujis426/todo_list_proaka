import { useState, useEffect } from 'react'

// ユーザー情報の型定義
interface User {
  id: number
  name: string
  email: string
  status: 'online' | 'offline'
}

function UserProfile() {
  // ユーザー情報を管理するState
  const [user, setUser] = useState<User | null>(null)
  // ローディング状態を管理するState
  const [loading, setLoading] = useState(true)
  // エラー状態を管理するState
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // ユーザーデータを取得する関数
    const fetchUser = async () => {
      try {
        // ローディング開始
        setLoading(true)
        
        // 擬似的な遅延を追加（実際のAPIコールの代わり）
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // ダミーデータ
        const dummyUser: User = {
          id: 1,
          name: "山田太郎",
          email: "yamada@example.com",
          status: "online"
        }
        
        // ユーザー情報を設定
        setUser(dummyUser)
        setError('')
      } catch (err) {
        // エラー処理
        setError('ユーザー情報の取得に失敗しました')
        setUser(null)
      } finally {
        // ローディング終了
        setLoading(false)
      }
    }

    // データ取得を実行
    fetchUser()
  }, []) // マウント時に1回だけ実行

  // ステータスに応じて表示を切り替え
  if (loading) {
    return <div>読み込み中...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!user) {
    return <div>ユーザーが見つかりません</div>
  }

  return (
    <div className="user-profile">
      <h2>ユーザープロフィール</h2>
      <div className="user-info">
        <p>名前: {user.name}</p>
        <p>メール: {user.email}</p>
        <p>状態: {user.status === 'online' ? 'オンライン' : 'オフライン'}</p>
      </div>
    </div>
  )
}

export default UserProfile