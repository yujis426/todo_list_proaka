import { useState } from 'react'


// フォームの型定義
interface FormData {
  name: string
  email: string
  message: string
}


// ?をつけることで、「エラーがないときはundefined（未定義）でもOK」という意味になります
interface FormErrors {
  name?: string    // 名前のエラーメッセージ（省略可能）
  email?: string   // メールアドレスのエラーメッセージ（省略可能）
  message?: string // メッセージのエラーメッセージ（省略可能）
}


function ContactForm() {
  // 複数の入力値をオブジェクトで管理
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })


  // エラーメッセージを保存する場所を作る
  const [errors, setErrors] = useState<FormErrors>({})


  // 入力内容をチェックする関数
  const validateForm = (): boolean => {
    // 新しいエラーを入れる箱を用意
    const newErrors: FormErrors = {}


    // 名前が2文字未満ならエラー
    if (formData.name.length < 2) {
      newErrors.name = 'お名前は2文字以上で入力してください'
    }


    // メールアドレスが正しい形式かチェック
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailPattern.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください'
    }


    // メッセージが10文字未満ならエラー
    if (formData.message.length < 10) {
      newErrors.message = 'メッセージは10文字以上で入力してください'
    }


    // エラーを保存
    setErrors(newErrors)
    // エラーがなければtrue、あればfalseを返す
    return Object.keys(newErrors).length === 0
  }


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // フォーム送信時の画面リロードを防ぐ
    e.preventDefault()
    // バリデーションチェックを実行
    if (validateForm()) {
      // エラーがなければ送信処理
      console.log('送信されたデータ:', formData)
      alert('送信しました！')
      // フォームを空に戻す
      setFormData({
        name: '',
        email: '',
        message: ''
      })
    }
  }


  // 入力値の更新をまとめて管理
  const handleChange = (
    // 入力フィールドまたはテキストエリアの変更イベント取得
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // 変更があった入力欄の名前と値を取得
    const { name, value } = e.target
    // フォームデータを更新（...は「既存のデータを全部コピーして」という意味）
    setFormData({
      ...formData,
      [name]: value  // 変更があった部分だけ新しい値に更新
    })
    // その項目のエラーメッセージをクリア
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      })
    }
  }


  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>問い合わせフォーム</h1>
      <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
        <div>
          <label>
            お名前：
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          {errors.name && <p className="error" style={{ color: 'red' }}>{errors.name}</p>}
        </div>
        <div>
          <label>
            メールアドレス：
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          {errors.email && <p className="error" style={{ color: 'red' }}>{errors.email}</p>}
        </div>
        <div>
          <label>
            メッセージ：
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </label>
          {errors.message && <p className="error" style={{ color: 'red' }}>{errors.message}</p>}
        </div>
        <button type="submit">送信</button>
      </form>
    </div>
  )
}


export default ContactForm