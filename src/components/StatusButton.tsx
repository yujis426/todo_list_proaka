// Union Typesの定義
type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';
type ButtonSize = 'small' | 'medium' | 'large';

interface StatusButtonProps {
  status: ButtonStatus;
  size?: ButtonSize;
  label: string;
  onClick: () => void;
}

function StatusButton({ 
  status, 
  size = 'medium', 
  label, 
  onClick 
}: StatusButtonProps) {
  // ステータスに応じたスタイルを設定
  const getStatusClass = (status: ButtonStatus): string => {
    switch (status) {
      case 'loading': return 'btn-loading';
      case 'success': return 'btn-success';
      case 'error': return 'btn-error';
      default: return '';
    }
  };

  return (
    <button 
      className={`btn ${getStatusClass(status)} btn-${size}`}
      onClick={onClick}
      disabled={status === 'loading'}
    >
      {status === 'loading' ? 'Loading...' : label}
    </button>
  );
}

export default StatusButton;