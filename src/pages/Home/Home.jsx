import React, {useState} from 'react';
import {AreaChartOutlined, CloudUploadOutlined, DatabaseOutlined, PieChartOutlined,} from '@ant-design/icons';
import {Breadcrumb, Layout, Menu, theme} from 'antd';
import Graphs from "./components/Graphs.jsx";
import TableData from "./components/TableData.jsx";
import UploadCsv from "./components/UploadCsv.jsx";

const {Header, Content, Footer, Sider} = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Transactions', 'sub1', <PieChartOutlined/>, [
        getItem('Graphs', '0', <AreaChartOutlined/>),
        getItem('Data', '1', <DatabaseOutlined/>),
        getItem('Bulk Upload', '2', <CloudUploadOutlined/>),
    ]),
];

const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    const [activeTab, setActiveTab] = useState('1');

    const renderContent = (tabNum) => {
        switch (tabNum) {
            case '0':
                return <Graphs/>
            case '1':
                return <TableData />
            case '2':
                return <UploadCsv />
            default:
                return  <TableData />
        }
    }

    return (
        <Layout style={{minHeight: '100vh', width: '100vw'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical"/>
                <Menu onClick={(e) => setActiveTab(e.key)} theme="dark" defaultSelectedKeys={['1']} mode="inline"
                      items={items}/>
            </Sider>
            <Layout>
                <Content style={{margin: '0 16px'}}>
                    {/*<Breadcrumb style={{ margin: '16px 0' }}>*/}
                    {/*    <Breadcrumb.Item>User</Breadcrumb.Item>*/}
                    {/*    <Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
                    {/*</Breadcrumb>*/}
                    <div
                        style={{
                            padding: 24,
                            minHeight: '85vh',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            marginTop: '3vh',
                        }}
                    >
                        {renderContent(activeTab)}
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>

                </Footer>
            </Layout>
        </Layout>
    )
}

export default Home
