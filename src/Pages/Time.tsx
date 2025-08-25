import Unixtime from '../Data/time';
import ResponsiveDrawer from '../Components/ResponsiveDrawer';
import '../App.css';
import { InitialUnixTime } from '../Data/time';

export default function Time() {
    return (
        <ResponsiveDrawer>
            <div style={{ maxWidth: 400, margin: '40px auto', textAlign: 'center' }}>
                <h2 style={{ color: 'black' }}>時間合わせ</h2>
                <InitialUnixTime />
                <Unixtime />
            </div>
        </ResponsiveDrawer>
    );
}