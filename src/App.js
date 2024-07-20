import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./Header";
import Login from "./Login";
import Sidebar from "./Sidebar";
import SearchPage from "./SearchPage";
import RecommendedVideos from "./RecommendedVideos";
import ForgotPasssword from "./ForgotPasssword";
import Signup from "./Signup";
import UploadVideo from "./UploadVideo";
import Shorts from "./Shorts";
import VideoPlayer from "./VideoPlayer";
import { VideoProvider } from "./VideoContext";
import Playlist from "./Playlist";
import PlayListVideos from "./PlayListVideos";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Subscription from "./Subscription";
import VideosByChannel from "./VideosByChannel";
import WatchHistory from "./WatchHistory";
import MyChannel from "./MyChannel";
import EditChannel from "./EditChannel";


function App() {

  return (
    <Router>
      <VideoProvider>
        <Routes>
          <Route
            path="/"
            element={
              <div className="parent">
                <Header className="header" />
                <div className="app_page">
                  <Sidebar className="sticky-sidebar" />
                  <RecommendedVideos />
                </div>
              </div>
            }
          />
          <Route
            path="/search/:searchTerm"
            element={
              <div className="parent">
                <Header className="header" />
                <div className="app_page">
                  <Sidebar />
                  <SearchPage />
                </div>
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div className="parent">
                <Login />
              </div>
            }
          />
          <Route
            path="/signup"
            element={
              <div>
                <Signup />
              </div>
            }
          />
          <Route
            path="/forgotpassword"
            element={
              <div>
                <ForgotPasssword />
              </div>
            }
          />
          <Route
            path="/upload_video"
            element={
              <div>
                <UploadVideo />
              </div>
            }
          />
          <Route
            path="/shorts"
            element={
              <div className="parent">
                <Header className="header" />
                <div className="app_page">
                  <Sidebar />
                  <Shorts />
                </div>
              </div>
            }
          />
          <Route
            path="/video/:videoId"
            element={
              <div className="parent">
                <Header className="header" />
                <div className="app_page">
                  <VideoPlayer />
                </div>
              </div>
            }
          />
          <Route
            path="/playlists"
            element={
              <div className="parent">
                <Header className="header" />
                <div className="app_page">
                  <Sidebar />
                  <Playlist />
                </div>
              </div>
            }
          />
          <Route
            path="/playlistvideo/:playlist_name"
            element={
              <div className="parent">
                <Header className="header" />
                <div className="app_page">
                  <Sidebar />
                  <PlayListVideos />
                </div>
              </div>
            }
          />
          <Route
            path="/Subscription"
            element={
              <div className="parent">
                <Header className="header" />
                <div className="app_page">
                  <Sidebar />
                  <Subscription />
                </div>
              </div>
            }
          />
          <Route
            path="/channelvideos/:channel_name"
            element={
              <div className="parent">
                <Header className="header" />
                <div className="app_page">
                  <Sidebar />
                  <VideosByChannel />
                </div>
              </div>
            }
          />

          <Route
            path="/history"
            element={
              <div className="parent">
                <Header className="header" />
                <div className="app_page">
                  <Sidebar />
                  <WatchHistory />
                </div>
              </div>
            }
          />

          <Route
            path="/channel/:user_name"
            element={
              <div className="parent">
                <Header className="header" />
                <div className="app_page">
                  <Sidebar />
                  <MyChannel />
                </div>
              </div>
            }
          />

          <Route 
          path="/editchannel"
          element={
            <EditChannel />
          }/>
        </Routes>
      </VideoProvider>
    </Router>
  );
}

export default App;
