import { useNavigate } from 'react-router-dom';
import Header from '../../layouts/Header.tsx'
import TopFilters from '../../components/TopFilters';
import DashboardCard from '../../components/Card/Card.tsx';
import TraceChart from '../../components/Chart/TraceChart';
import styles from './Home.module.css';

export default function Home() {
    const navigate = useNavigate();

    const homeHeaderActions = (
        <button className = { styles.button } onClick = { () => alert('Configure Tracing 클릭!') }>Configure Tracing</button>
    )
    return (
        <>
            <Header title = "Home" actions = { homeHeaderActions } />
            <div className={styles.container}>
                {/* 상단 필터바 */}
                <TopFilters />

                {/* 카드 섹션 */}
                <div className={styles.cardRow}>
                    <DashboardCard title="Traces" onClick={() => navigate('/tracing')}>
                        <div className={styles.metric}>0</div>
                        <p className={styles.sub}>Total traces tracked</p>
                        <div className={styles.tag}>qa</div>
                    </DashboardCard>

                    <DashboardCard title="Model Cost" onClick={() => navigate('/cost')}>
                        <div className={styles.metric}>$0.00</div>
                        <p className={styles.sub}>Total cost</p>
                    </DashboardCard>

                    <DashboardCard title="Scores" onClick={() => navigate('/scores')}>
                        <div className={styles.metric}>0</div>
                        <p className={styles.sub}>Total scores tracked</p>
                    </DashboardCard>
                </div>

                {/* 차트 섹션 */}
                <div className={styles.chartSection}>
                    <TraceChart />
                </div>
            </div>
        </>
  );
}
