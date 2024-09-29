import { createBrowserRouter } from 'react-router-dom';
import { DefaultLayout } from '../layouts/default-layouts';
import { AdminClaimPage } from '../pages/admin-claim-page';
import { MarketPage } from '../pages/market-page';
import { HomePage } from '../pages/home-page';
import { AssetPage } from '../pages/asset-page';
import { AdminUserPage } from '../pages/admin-user-page';

export const routes = {
    home: '/',
    adminClaim: '/admin-claim',
    adminUser: '/admin-user',
    market: '/market',
    asset: '/asset',
}

export const router = createBrowserRouter([{
    path: routes.home, Component: DefaultLayout, children: [{
        path: routes.home, Component: HomePage
    },
    { path: routes.adminClaim, Component: AdminClaimPage },
    { path: routes.adminUser, Component: AdminUserPage },
    { path: routes.market, Component: MarketPage },
    { path: routes.asset, Component: AssetPage },
    ]
}])