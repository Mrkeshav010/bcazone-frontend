export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1565C0',
        'primary-light': '#1E88E5',
        'primary-soft': '#E3F2FD',
        accent: '#42A5F5',
        'bca-bg': '#F0F4F8',
        'bca-border': '#BBDEFB',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        xl2: '18px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(21, 101, 192, 0.10)',
        btn: '0 4px 14px rgba(21, 101, 192, 0.30)',
      },
    },
  },
  plugins: [],
};