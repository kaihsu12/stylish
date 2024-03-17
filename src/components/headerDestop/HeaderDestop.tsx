//react
import { useNavigate } from 'react-router-dom';
//fontaswesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  // faCartShopping,
  // faMessage,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
//types
import { Category } from '../../types/type';
// styling
import './HeaderDestop.scss';

interface HeaderDestopProps {
  // setIsShow: (show: boolean) => void;
  setMenuId: (id: string) => void;
  categoryAll: Category;
}

const HeaderDestop: React.FC<HeaderDestopProps> = (props) => {
  const navigate = useNavigate();

  const { isAuthenticated, logout }: { isAuthenticated: boolean; logout: any } =
    useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className='headerDestop'>
      <div className='logo' onClick={() => navigate('/main')}>
        <h1>S.tylish</h1>
      </div>
      <ul className='menu-sec medium-14'>
        {props.categoryAll?.map?.((type) => {
          return (
            <li
              key={`${type.id}`}
              className='menu-tile'
              onClick={() => {
                // props?.setIsShow(true);
                props?.setMenuId(`&categoryId=${type.id}`);
              }}
            >
              {type.name}
            </li>
          );
        })}
      </ul>
      <div className='auth-sec'>
        {/* <FontAwesomeIcon
            className='fa-icon'
            icon={faUser}
            onClick={() => navigate('/login')}
          /> */}

        {isAuthenticated ? (
          <div className='logout-group'>
            {/* <FontAwesomeIcon
              className='fa-icon'
              icon={faUser}
              onClick={() => navigate('/login')}
            /> */}
            <div className='auth-btn logout' onClick={handleLogout}>
              <span className='medium-14 login'>登出</span>
            </div>
          </div>
        ) : (
          <div className='auth-btn login' onClick={() => navigate('/login')}>
            <span className='medium-14'>登入</span>
          </div>
        )}

        {/* <FontAwesomeIcon className='fa-icon' icon={faCartShopping} /> */}
      </div>
    </header>
  );
};

export default HeaderDestop;
