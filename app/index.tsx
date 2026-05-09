import { Redirect } from 'expo-router';
import { useAppSelector } from '../Redux/hooks';

export default function Index() {
    const token = useAppSelector((state) => state.auth.token);

    if (token) {
        return <Redirect href="/(driver)/driver" />;
    }

    return <Redirect href="/splash" />;
}
