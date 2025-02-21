function Greeting(props: { name: string }) {
    return (
      <div className="greeting">
        <h2>こんにちは、{props.name}さん！</h2>
      </div>
    )
  }
  
  export default Greeting