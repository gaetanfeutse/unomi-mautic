import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import MainContent from './Components/MainContent';
import CreateSegment from './Components/CreateSegment';
import ProfileList from './Components/ProfileList';
import SegmentList from './Components/SegmentList';
import ProfileDetails from './Components/ProfileDetail';
import SegmentDetails from './Components/SegmentDetails';
import RuleList from './Components/RuleList';
import CreateRule from './Components/CreateRule';
import ProfileDetail from './Components/ProfileDetail';
import CreateScopeComponent from './Components/CreateScopeComponent';

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Sidebar />
        <MainContent>
          <Routes>
          <Route path="/create-segment" element={<CreateSegment />} />
            <Route path="/create-rule" element={<CreateRule />} />
            <Route path="/rules" element={<RuleList />} />
            <Route path="/profile/:id" element={<ProfileDetail />} />
            {/* <Route path="/segments/:segmentId" component={SegmentDetails} /> */}
            <Route path="/profiles" element={<ProfileList />} />
            <Route path="/profiles" element={<ProfileList />} />
            <Route path="/segments" element={<SegmentList />} />
            {/* <Route path="/" exact component={SegmentList} /> */}
            <Route path="/profiles/:id" element={<ProfileDetails />} />
            <Route path="/segment/:segmentId" element={<SegmentDetails />} />
            <Route path="/create-scopes" element={<CreateScopeComponent />}/>
          </Routes>
        </MainContent>
      </div>
    </Router>
  );
}

export default App;
