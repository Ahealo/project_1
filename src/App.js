//导入路由组件
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './index.css'
//导入组件
import AuthRoute from './components/AuthRoute'
const Home = lazy(() => import('./pages/Home/index.js'))
const CityList = lazy(() => import('./pages/CityList/index.js'))
const Map = lazy(() => import('./pages/Map/index.js'))
const HouseDetail = lazy(() => import('./pages/HouseDetail/index.js'))
const Login = lazy(() => import('./pages/Login/index.js'))
const Rent = lazy(() => import('./pages/Rent/index.js'))
const Add = lazy(() => import('./pages/Rent/Add/index.js'))
const Search = lazy(() => import('./pages/Rent/Search/index.js'))
const Favorite = lazy(() => import('./pages/Favorite/index.js'))
const Registe = lazy(() => import('./pages/Registe/index.js'))
function App() {
  return (
    <Router>
      <Suspense fallback={<div className="loading">loading...</div>}>
        {/* 路由重定向，配置默认路由 */}
        <Route path="/" exact render={() => <Redirect to="/home" />} />

        {/* 配置路由 */}
        <Route path="/home" component={Home} />
        <Route path="/citylist" component={CityList} />
        <Route path="/map" component={Map} />
        <Route path="/detail/:id" component={HouseDetail} />
        <Route path="/login" component={Login} />
        <Route path="/registe" component={Registe} />
        <AuthRoute exact path="/rent" component={Rent} />
        <AuthRoute path="/rent/add" component={Add} />
        <AuthRoute path="/rent/search" component={Search} />
        <AuthRoute path="/favorate" component={Favorite} />
      </Suspense>
    </Router>
  )
}
export default App
