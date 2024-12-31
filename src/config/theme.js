import { useSelector } from 'react-redux';

export const BaseColor = {
  // primary: '#2874F0',
  primary: '#BF0000',
  primaryLight: '#DFE7F4',
  success: '#0DBD75',
  successLight:'#E6F8ED',
  danger: '#FF3E30',
  dangerLight:'#FFEBE6',
  secondary: '#E69C00',
  warning: '#FFB02C',
  dark: '#2F2F2F',
  gray: 'gray',
  info: '#627EEA',
  label: '#8A8A8A',
  backgroundColor: '#fff',
  black: '#000',
};

const Light = {
  // Light theme
  card: '#fff',
  background: '#F6F6F6',
  text: '#000000',
  textLight: '#8A8A8A',
  title: '#000000',
  borderColor: 'rgba(0, 0, 0, 0.1)',
  input: '#F9F9F9',
  placeholder: 'rgba(0, 0, 0, 0.50)',
  darkBackground:'#fff'
};

const Dark = {
  //dark theme
  card: '#1C212E',
  background: '#0C101C',
  text: '#B8B8B8',
  textLight: '#6C6E77',
  title: '#fff',
  border: 'rgba(255,255,255,0.1)',
  borderColor: 'rgba(255, 255, 255, .1)',
  input: '#151A28',
  placeholder: 'rgba(255,255,255,.5)',
  darkBackground:'#000'
};

export const useTheme = () => {
  const { theme } = useSelector(state => state.ApplicationReducer);
  
  if (theme === 'dark') {
    return {theme: Dark};
  }
  return {theme: Light};
};