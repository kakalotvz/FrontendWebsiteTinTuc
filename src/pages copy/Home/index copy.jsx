import Banner from "../../components/Banner/Banner"
import GameLienQuan from "../../components/GameLienQuan/GameLienQuan"
import ThongBaoDauTrang from "../../components/Header/ThongBao"
import ListGameNew from "../../components/ListGameNew/ListGameNew"
import ThongBao from "../../components/ThongBao/ThongBao"

const Home = () => {
  return (
    <>
      <Banner/>
      <ListGameNew/>
      <ThongBao/>
      <ThongBaoDauTrang/> 
      <GameLienQuan/>
    </>
  )
}
export default Home