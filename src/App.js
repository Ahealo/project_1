//导入路由组件
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
//导入主页和城市两个组件
import Home from './pages/Home/index.js'
import CityList from './pages/CityList/index.js'
import Map from './pages/Map/index.js'
import HouseDetail from './pages/HouseDetail/index.js'
import Login from './pages/Login/index.js'
import Rent from './pages/Rent/index.js'
import Add from './pages/Rent/Add/index.js'
import Search from './pages/Rent/Search/index.js'
import AuthRoute from './components/AuthRoute/index.js'
import Registe from './pages/Registe/index.js'
function App() {
  return (
    <Router>
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
    </Router>
  )
}
export default App
