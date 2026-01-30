import { useRealtimeSync } from '../features/realtime-sync';
import { useRows, useSelectOptions } from '../entities/row';
import { DataTable } from '../widgets/data-table';
import { Spinner } from '../shared/ui';
import styles from './App.module.css';

export function App() {
    const { isConnected, serverInfo } = useRealtimeSync();
    const { data: rowsData, isLoading, error } = useRows();
    const { data: options } = useSelectOptions();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Airtable Clone</h1>
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={`${styles.statusDot} ${isConnected ? styles.connected : ''}`} />
                        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                    {serverInfo && (
                        <div className={styles.stat}>
                            <span>Server: {serverInfo.serverId}</span>
                        </div>
                    )}
                    {rowsData && (
                        <div className={styles.stat}>
                            <span>{rowsData.data.length.toLocaleString()} rows</span>
                        </div>
                    )}
                    {rowsData?.meta && (
                        <div className={styles.stat}>
                            <span>Loaded in {rowsData.meta.fetchTime}ms</span>
                        </div>
                    )}
                </div>
            </header>

            <main className={styles.main}>
                {isLoading && (
                    <div className={styles.center}>
                        <Spinner size="lg" />
                    </div>
                )}

                {error && (
                    <div className={styles.center}>
                        <p className={styles.error}>Error: {(error as Error).message}</p>
                    </div>
                )}

                {rowsData && options && (
                    <DataTable data={rowsData.data} options={options} />
                )}
            </main>
        </div>
    );
}