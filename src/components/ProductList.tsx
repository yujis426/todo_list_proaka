import { useState } from 'react'


// 商品の型を定義
interface Product {
  id: number
  name: string
  price: number
  stock: number
  isFavorite: boolean
}


function ProductList() {
  // 商品リストの状態を管理
  const [products, setProducts] = useState<Product[]>([
    // { id: 1, name: "コーヒー", price: 400, stock: 5, isFavorite: false },
    // { id: 2, name: "紅茶", price: 300, stock: 3, isFavorite: false },
    // { id: 3, name: "緑茶", price: 350, stock: 0, isFavorite: false }
  ])


  // お気に入りの切り替え
  const toggleFavorite = (id: number) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, isFavorite: !product.isFavorite } : product
    ))
  }


  return (
    <div className="product-list">
      <h2>商品一覧</h2>


      {/* 商品がない場合の表示 */}
      {products.length === 0 && (
        <p>商品がありません</p>
      )}


      {/* 商品リストの表示 */}
      {products.map(product => (
        <div key={product.id} className="product-item">
          <div className="product-info">
            <h3>{product.name}</h3>
            <p>価格: ¥{product.price}</p>


            {/* 在庫の条件付き表示 */}
            {product.stock > 0 ? (
              <p className="in-stock">在庫: {product.stock}個</p>
            ) : (
              <p className="out-of-stock">在庫切れ</p>
            )}
          </div>


          {/* お気に入りボタン */}
          <button
            className={product.isFavorite ? "favorite active" : "favorite"}
            onClick={() => toggleFavorite(product.id)}
          >
            {product.isFavorite ? "★" : "☆"}
          </button>
        </div>
      ))}


      {/* お気に入りの数を表示 */}
      {products.filter(product => product.isFavorite).length > 0 && (
        <div className="favorite-count">
          お気に入りの商品: {products.filter(product => product.isFavorite).length}点
        </div>
      )}
    </div>
  )
}


export default ProductList