import { useAuthStore } from "../store/useAuthStrore"

const HomePage = () => {
  const {logout} = useAuthStore();
  return (
    <div>
      <h1>HomePage</h1>
      <button 
        onClick={logout}
        className="py-4 px-2 bg-red-600">Logout</button>
    </div>
  )
}

export default HomePage