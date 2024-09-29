import { createBrowserRouter } from 'react-router-dom';
import { DefaultLayout } from '../layouts/default-layouts';
import { AdminPage } from '../pages/admin-page';
import { MarketPage } from '../pages/market-page';
import { HomePage } from '../pages/home-page';
import { AssetPage } from '../pages/asset-page';

export const routes = {
    home: '/',
    admin: '/admin',
    market: '/market',
    asset: '/asset'
}

export const router = createBrowserRouter([{
    path: routes.home, Component: DefaultLayout, children: [{
        path: routes.home, Component: HomePage
    },
    { path: routes.admin, Component: AdminPage },
    { path: routes.market, Component: MarketPage },
    { path: routes.asset, Component: AssetPage },
    ]
}])