import BackgroundElements from './components/BackgroundElements';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

function App() {
  return (
    <>
      {/* Background Elements */}
      <BackgroundElements />

      {/* Main Content Canvas */}
      <main className="flex-1 flex gap-6 overflow-hidden h-full z-10 w-full p-6 relative">
        <Sidebar />
        <ChatList />
        <ChatWindow />
      </main>
    </>
  );
}

export default App;
