import {useEffect, useState} from "react";
import callApi from "../../../utility/apiCaller.js";
import dayjs from "dayjs";
import {Button, DatePicker, Drawer, Form, Input, Modal, Select, Table} from "antd";
import Loader from "../../../components/Loader.jsx";
import {CodepenCircleFilled, DeleteFilled, EditFilled} from "@ant-design/icons";
import {showNotification} from "../../../utility/utility.js";

const transactionTypes = [
    {
        key: "Completed",
        value: "Completed"
    },
    {
        key: "Pending",
        value: "Pending"
    },
    {
        key: "Failed",
        value: "Failed"
    },
]

const TableData = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [count, setCount] = useState(0);
    const [activeTransaction, setActiveTransaction] = useState({});
    const [editFormOpen, setEditFormOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 50,
        },
    });

    useEffect(() => {
        fetchTransactionData();
    }, []);

    const fetchTransactionData = (pageNum, pageSize) => {
        callApi('transactions/list', 'post', {
            pageNum: pageNum ? pageNum : 1,
            pageSize: pageSize ? pageSize : 50
        }).then(res => {
            if (res.status === 'Success') {
                setTransactions(res.data.transactionList);
                setCount(res.data.transactionCount);
                setTableParams((prev) => ({
                    ...prev,
                    pagination: {
                        ...prev.pagination,
                        count: res.data.transactionCount
                    }
                }))
                setIsLoading(false);
            }
        }).catch(e => {
            console.log(e)
        })
    }

    const handleEdit = (data) => {
        setActiveTransaction(data);
        setEditFormOpen(true);
    }

    const handleDelete = (data) => {
        setActiveTransaction(data);
        setDeleteModalOpen(true);
    }

    const handleDeleteCancel = () => {
        setActiveTransaction({});
        setDeleteModalOpen(false);
    }

    const handleEditCancel = () => {
        setActiveTransaction({});
        setEditFormOpen(false);
    }

    const handleDeleteTransaction = () => {
        callApi(`transactions/${activeTransaction._id}/remove`, 'post').then(res => {
            if (res.status === 'Success') {
                showNotification('Transaction Deleted', 'success');
                fetchTransactionData();
            } else {
                showNotification('Error', 'error')
            }

            setActiveTransaction({});
            setDeleteModalOpen(false);
        })
    }

    const handleUpdateTransaction = () => {
        callApi(`transactions/${activeTransaction._id}/update`, 'post', {transaction: activeTransaction}).then(res => {
            if (res.status === 'Success') {
                showNotification('Transaction Updated', 'success');
                setEditFormOpen(false);
                setActiveTransaction({});
                fetchTransactionData();
            } else {
                showNotification('Error', 'error')
            }

            setActiveTransaction({});
            setDeleteModalOpen(false);
        })
    }

    const columns = [
        {
            title: 'TransactionID',
            dataIndex: 'TransactionID',
            key: 'TransactionID',
        },
        {
            title: 'CustomerName',
            dataIndex: 'CustomerName',
            key: 'CustomerName',
        },
        {
            title: 'TransactionDate',
            dataIndex: 'TransactionDate',
            key: 'TransactionDate',
        },
        {
            title: 'Amount',
            dataIndex: 'Amount',
            key: 'Amount',
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
        },
        {
            title: 'InvoiceURL',
            dataIndex: 'InvoiceURL',
            key: 'InvoiceURL',
        },
        {
            title: 'Actions',
            dataIndex: 'Actions',
            key: 'Actions',
            render: (_, record) => (
                <div style={{display: "flex", gap: "4px"}}>
                    <Button
                        onClick={() => handleEdit(record)}
                    >
                        <EditFilled/>
                    </Button>
                    <Button
                        onClick={() => handleDelete(record)}
                    >
                        <DeleteFilled/>
                    </Button>
                </div>
            )
        },
    ];

    const handleChange = (keyName, keyValue) => {
        setActiveTransaction({
            ...activeTransaction,
            keyName: keyValue
        })
    }

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
        });
    }

    return (
        isLoading ? <Loader/> :
            <div
                style={{
                    height: '100%',
                    overflow: "scroll"
                }}
            >
                <Modal
                    open={deleteModalOpen}
                    onCancel={handleDeleteCancel}
                    okText={'Delete'}
                    onOk={handleDeleteTransaction}
                >
                    Are you Sure you want to delete this transaction ?
                </Modal>
                <Drawer
                    destroyOnClose
                    width={'40vw'}
                    open={editFormOpen}
                    onClose={handleEditCancel}
                    footer={<Button type={'primary'} size={'large'} style={{width: "60%", marginLeft: "20%"}}
                                    onClick={handleUpdateTransaction}>Update</Button>}
                >
                    <label>TransactionId</label>
                    <Input style={{margin: "16px 0"}} disabled type={'text'}
                           defaultValue={activeTransaction.TransactionID}/>
                    <label>CustomerName</label>
                    <Input onChange={(value) => handleChange('CustomerName', value)} style={{margin: "16px 0"}} type={'text'}
                           defaultValue={activeTransaction.CustomerName}/>
                    <label>TransactionDate</label>
                    <DatePicker onChange={e => handleChange('TransactionDate', dayjs(e).toISOString())} defaultValue={dayjs(activeTransaction.TransactionDate)} style={{margin: "16px 0", display: "block"}} />
                    <label>Amount</label>
                    <Input onChange={(value) => handleChange('Amount', value)} style={{margin: "16px 0"}} type={'number'}
                           defaultValue={activeTransaction.Amount}/>
                    <label>Status</label>
                    <Select onChange={e => handleChange('Status', e)} options={transactionTypes} style={{margin: "16px 0", display: "block"}} defaultValue={activeTransaction.Status}/>
                    <label>InvoiceURL</label>
                    <Input onChange={(value) => handleChange('InvoiceURL', value)} style={{margin: "16px 0"}} type={'text'}
                           defaultValue={activeTransaction.InvoiceURL}/>
                </Drawer>
                <Table
                    onChange={handleTableChange}
                    style={{maxHeight: "80vh"}}
                    pagination={tableParams.pagination}
                    dataSource={transactions.map(transaction => ({
                        ...transaction,
                        key: transaction._id,
                        TransactionData: dayjs(transaction.TransactionData).format('DD/MMM/YYYY')
                    }))} columns={columns}/>
            </div>
    )
}

export default TableData
