import React, { ReactElement, useEffect, useState } from 'react';
import { Button } from 'antd';

type Theme = 'l' | 'd';

export function ThemeSwitcher(): ReactElement {
  const [theme, setTheme] = useState<Theme>('l');
  useEffect(() => {
    console.log('theme effect', theme);
    const classList = document.querySelector('html').classList;
    classList.remove('thm-l', 'thm-d');
    classList.add(`thm-${theme}`);
    window.less.modifyVars({
      '@primary-color': `rgb(${Math.round(Math.random() * 100)}, ${Math.round(Math.random() * 100)}, ${Math.round(
        Math.random() * 100,
      )})`,
    });
  }, [theme]);

  return (
    <div className="c-theme-switcher">
      <Button onClick={() => setTheme(theme === 'l' ? 'r' : 'l')}>🌈 Randomize color !</Button>
      {/*<Button onClick={() => setTheme('l')}>Light</Button> -<Button onClick={() => setTheme('d')}>Dark</Button>*/}
    </div>
  );
}
