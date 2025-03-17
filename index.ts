import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import {GameData, User, FiltersParams} from './types';

const app = new Koa();
const router = new Router();

// 模拟用户数据
const users: User[] = [
    { username: 'player1', password: 'player1' },
    { username: 'player2', password: 'player2' },
];

// 导入游戏数据
const gameData: GameData = require('./data.json');

app.use(bodyParser());
app.use(cors());

// 登录接口
router.post('/login', async (ctx) => {
    const { username, password } = ctx.request.body as { username: string; password: string };
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        ctx.body = { success: true, username };
    } else {
        ctx.status = 401;
        ctx.body = { success: false, message: 'Invalid credentials' };
    }
});

// 获取筛选和排序后的游戏列表
router.post('/games', async (ctx) => {
    const { name, providerIds, groupId, sortBy } = ctx.request.body as FiltersParams;

    let filteredGames = gameData.games;

    // 根据游戏名称过滤
    if (name) {
        filteredGames = filteredGames.filter((game) =>
            game.name.toLowerCase().includes((name as string).toLowerCase())
        );
    }

    // 根据提供商过滤
    if (providerIds && providerIds.length) {
        filteredGames = filteredGames.filter((game) => providerIds.includes(game.provider));
    }

    // 根据游戏组过滤
    if (groupId) {
        const group = gameData.groups.find((g) => g.id === Number(groupId));
        if (group) {
            filteredGames = filteredGames.filter((game) => group.games.includes(game.id));
        }
    }

    // 根据排序规则排序
    if (sortBy) {
        filteredGames = [...filteredGames].sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'date-desc':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                default:
                    return 0; // 默认不排序
            }
        });
    }

    ctx.body = filteredGames;
});


// 获取所有提供商
router.get('/providers', async (ctx) => {
    ctx.body = gameData.providers;
});

// 获取所有游戏组
router.get('/groups', async (ctx) => {
    ctx.body = gameData.groups;
});

// 根据游戏组 ID 获取游戏列表
router.get('/groups/:id/games', async (ctx) => {
    const groupId = parseInt(ctx.params.id, 10);
    const group = gameData.groups.find((g) => g.id === groupId);

    if (!group) {
        ctx.status = 404;
        ctx.body = { message: 'Group not found' };
        return;
    }

    ctx.body = gameData.games.filter((game) => group.games.includes(game.id));
});

// 注册路由
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
