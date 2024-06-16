// components/ThemeToggle.tsx
import { useContext } from 'react';
import { Switch } from '@nextui-org/react';
import { ThemeContext } from '../../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <Switch
            checked={theme === 'dark'}
            onChange={toggleTheme}
        >{`${theme === 'dark' ? 'Dark' : 'Light'} Mode`}</Switch>
    );
};

export default ThemeToggle;
