import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../features/authSlice';

export default function Settings() {
  const dispatch = useDispatch();
  const { theme } = useSelector((s) => s.auth);
  const dark = theme === 'dark';

  return (
    <>
      <header className="flex justify-between px-5 pt-5 items-center">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">Settings</h1>
          <p className={dark ? 'text-gray-400' : 'text-gray-400'}>
            Customize your preference system theme.
          </p>
        </div>
      </header>
      <div className="flex gap-5 mx-5 pb-5">
        {['light', 'dark'].map((t) => {
          const isActive = theme === t;
          const isDarkCard = t === 'dark';
          return (
            <button
              key={t}
              onClick={() => dispatch(setTheme(t))}
              className={`flex select-none cursor-pointer flex-col flex-1 rounded-xl border text-left transition-all ${
                isActive
                  ? 'border-blue-500 ring-2 ring-blue-500'
                  : dark ? 'border-[#3a3a3a]' : 'border-gray-200'
              }`}
            >
              <header className={`flex items-center justify-between p-5 border-b ${dark ? 'border-[#3a3a3a]' : 'border-gray-200'}`}>
                <div className="flex flex-col">
                  <h1 className="text-base font-medium capitalize">{t} Theme</h1>
                  <p className="text-gray-400 text-xs">
                    Select and change your system theme to {t}.
                  </p>
                </div>
                {isActive && (
                  <span className="px-4 py-2 text-xs rounded-xl ring ring-green-500 bg-green-100 text-green-500">
                    Active
                  </span>
                )}
              </header>
              <main className="h-[350px] p-5 flex items-center justify-center">
                <section
                  className={`${isDarkCard ? 'bg-[#2d2d2d]' : 'bg-white'} border rounded-xl ${
                    isDarkCard ? 'border-[#3a3a3a]' : 'border-gray-200'
                  } h-full w-full flex flex-col p-5`}
                >
                  <header className={`${isDarkCard ? 'bg-[#3d3d3d]' : 'bg-gray-100'} h-[50px] flex items-center rounded-xl gap-2 px-5 justify-end`}>
                    <span className="h-5 w-5 rounded-sm bg-blue-500"></span>
                    <span className="h-5 w-5 rounded-sm bg-rose-500"></span>
                  </header>
                  <div className="flex gap-5 mt-5 flex-1">
                    <div className={`${isDarkCard ? 'bg-[#3d3d3d]' : 'bg-gray-100'} flex-1 rounded-xl h-full`}></div>
                    <div className={`${isDarkCard ? 'bg-[#3d3d3d]' : 'bg-gray-100'} rounded-xl h-full w-[150px]`}></div>
                  </div>
                </section>
              </main>
            </button>
          );
        })}
      </div>
    </>
  );
}
