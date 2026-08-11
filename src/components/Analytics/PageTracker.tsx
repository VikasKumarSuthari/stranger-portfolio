import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pushToDataLayer } from '../../utils/analytics';

const PageTracker = () => {
    const location = useLocation();

    useEffect(() => {
        pushToDataLayer('virtual_pageview', {
            page_path: location.pathname + location.search,
            page_title: document.title,
        });
    }, [location]);

    return null;
};

export default PageTracker;
