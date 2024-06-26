import React, { useState, useEffect } from "react";
import { Container, Text, VStack, HStack, Box, Button, Table, Thead, Tbody, Tr, Th, Td, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Select, useDisclosure } from "@chakra-ui/react";
import { FaPlus, FaEdit } from "react-icons/fa";

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [transactions, setTransactions] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState({ id: "", description: "", amount: "", status: "", transaction_date: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTransaction({ ...currentTransaction, [name]: value });
  };

  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  const handleAddTransaction = () => {
    let updatedTransactions;
    if (isEditing) {
      updatedTransactions = transactions.map((txn) => (txn.id === currentTransaction.id ? currentTransaction : txn));
    } else {
      updatedTransactions = [...transactions, { ...currentTransaction, id: transactions.length + 1 }];
    }
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    setCurrentTransaction({ id: "", description: "", amount: "", status: "", transaction_date: "" });
    setIsEditing(false);
    onClose();
  };

  const handleEditTransaction = (transaction) => {
    setCurrentTransaction(transaction);
    setIsEditing(true);
    onOpen();
  };

  const handleDateFilter = () => {
    const filteredTransactions = transactions.filter((txn) => {
      const txnDate = new Date(txn.transaction_date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return txnDate >= start && txnDate <= end;
    });
    setTransactions(filteredTransactions);
  };

  const totalAmount = transactions.reduce((acc, txn) => {
    return txn.status === "credit" ? acc + parseFloat(txn.amount || 0) : acc - parseFloat(txn.amount || 0);
  }, 0);

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <HStack justifyContent="space-between" width="100%">
          <HStack>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Button onClick={handleDateFilter}>Filter</Button>
          </HStack>
          <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={onOpen}>
            Add Transaction
          </Button>
        </HStack>
        <Box width="100%" overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Description</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Transaction Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((transaction) => (
                <Tr key={transaction.id}>
                  <Td>{transaction.id}</Td>
                  <Td>{transaction.description}</Td>
                  <Td>{transaction.amount}</Td>
                  <Td>{transaction.status}</Td>
                  <Td>{transaction.transaction_date}</Td>
                  <Td>
                    <Button size="sm" leftIcon={<FaEdit />} onClick={() => handleEditTransaction(transaction)}>
                      Edit
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <HStack justifyContent="flex-end" width="100%">
          <Text fontSize="lg" fontWeight="bold">
            Total: {totalAmount}
          </Text>
        </HStack>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Edit Transaction" : "Add Transaction"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="description" mb={4}>
              <FormLabel>Description</FormLabel>
              <Input name="description" value={currentTransaction.description} onChange={handleInputChange} />
            </FormControl>
            <FormControl id="amount" mb={4}>
              <FormLabel>Amount</FormLabel>
              <Input name="amount" value={currentTransaction.amount} onChange={handleInputChange} />
            </FormControl>
            <FormControl id="status" mb={4}>
              <FormLabel>Status</FormLabel>
              <Select name="status" value={currentTransaction.status} onChange={handleInputChange}>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </Select>
            </FormControl>
            <FormControl id="transaction_date" mb={4}>
              <FormLabel>Transaction Date</FormLabel>
              <Input type="date" name="transaction_date" value={currentTransaction.transaction_date} onChange={handleInputChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddTransaction}>
              {isEditing ? "Save Changes" : "Add Transaction"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Index;