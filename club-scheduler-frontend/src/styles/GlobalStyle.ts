import { createGlobalStyle } from 'styled-components';
import { colors, typography } from './design-tokens';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${typography.fontFamily.primary};
    font-size: ${typography.fontSize.base};
    line-height: ${typography.lineHeight.normal};
    color: ${colors.textPrimary};
    background-color: ${colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${typography.fontWeight.medium};
    line-height: ${typography.lineHeight.tight};
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
  }

  input, textarea {
    font-family: inherit;
    outline: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* React DatePicker 스타일 오버라이드 */
  .react-datepicker {
    font-family: ${typography.fontFamily.primary};
    border: 1px solid ${colors.border};
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .react-datepicker__header {
    background-color: ${colors.backgroundSecondary};
    border-bottom: 1px solid ${colors.border};
    border-radius: 8px 8px 0 0;
  }

  .react-datepicker__current-month {
    color: ${colors.textPrimary};
    font-weight: ${typography.fontWeight.medium};
  }

  .react-datepicker__day-name {
    color: ${colors.textSecondary};
    font-weight: ${typography.fontWeight.medium};
  }

  .react-datepicker__day {
    color: ${colors.textPrimary};
    
    &:hover {
      background-color: ${colors.backgroundSecondary};
    }
  }

  .react-datepicker__day--selected {
    background-color: ${colors.primary};
    color: ${colors.background};
  }

  .react-datepicker__day--today {
    font-weight: ${typography.fontWeight.bold};
  }

  .react-datepicker__navigation {
    border: none;
    background: none;
    color: ${colors.textPrimary};
    
    &:hover {
      background-color: ${colors.backgroundSecondary};
    }
  }
`;
