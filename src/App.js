import "./App.css";
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
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext"; // Corrected import

function App() {
  return (
      <Router>
        <UserProvider>
          <AuthProvider>
            <VideoProvider>
              <Routes>
                <Route
                  path="/"
                  element={
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
                    <Header className="header" />
                    <div className="app_page">
                      <VideoPlayer/>
                    </div>
                  </div>
                  }
                />
                <Route
                  path="/playlists"
                  element={
                    <div>
                      <Header className="header" />
                      <div className="app_page">
                        <Sidebar />
                        <Playlist />
                      </div>
                    </div>
                  }
                />
                <Route 
                  path="/playlistvideos"
                  element={
                    <div>
                      <Header className="header" />
                      <div className="app_page">
                        <Sidebar />
                        <PlayListVideos />
                      </div>
                    </div>
                  }/>
              </Routes>
            </VideoProvider>
          </AuthProvider>
        </UserProvider>
      </Router>
  );
}

export default App;
