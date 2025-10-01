import AdminStatistics from "../../../components/Dashboard/Admin/AdminStatistics";
import GuestStatistics from "../../../components/Dashboard/Guest/GuestStatistics";
import HostStatistics from "../../../components/Dashboard/Host/HostStatistics";
import useRole from "../../../hooks/useRole";

const Statistics = () => {
    const[role, isLoading] = useRole();
    return (
        <div>
            {role === 'admin' && <AdminStatistics></AdminStatistics>}
            {role === 'host' && <HostStatistics></HostStatistics>}
            {role === 'guest' && <GuestStatistics></GuestStatistics>}
        </div>
    );
};

export default Statistics;