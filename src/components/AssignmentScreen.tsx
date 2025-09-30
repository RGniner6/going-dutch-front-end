import React, { useState, useEffect, useMemo } from 'react';
import { ReceiptAnalysisResult, Person, ItemAssignment, PersonCost } from '../types/receipt';
import './AssignmentScreen.css';

interface AssignmentScreenProps {
  receiptData: ReceiptAnalysisResult;
  people: Person[];
  itemAssignments: ItemAssignment[];
  onItemAssignmentsUpdated: (assignments: ItemAssignment[]) => void;
  onBack: () => void;
}

const AssignmentScreen: React.FC<AssignmentScreenProps> = ({
  receiptData,
  people,
  itemAssignments,
  onItemAssignmentsUpdated,
  onBack,
}) => {
  const [assignments, setAssignments] = useState<ItemAssignment[]>(itemAssignments);

  useEffect(() => {
    // Initialize assignments if empty
    if (assignments.length === 0) {
      const initialAssignments: ItemAssignment[] = [];
      
      // Add regular items
      receiptData.items.forEach((_, index) => {
        initialAssignments.push({
          itemId: `item-${index}`,
          assignedTo: [],
        });
      });
      
      // Add additional costs that are marked as additionalCost: true
      if (receiptData.additionalCosts) {
        receiptData.additionalCosts.forEach((_, index) => {
          const additionalCost = receiptData.additionalCosts![index];
          if (additionalCost.additionalCost) {
            initialAssignments.push({
              itemId: `additional-cost-${index}`,
              assignedTo: people.map(p => p.id), // Assign to all people by default
            });
          }
        });
      }
      
      setAssignments(initialAssignments);
      onItemAssignmentsUpdated(initialAssignments);
    }
  }, [receiptData.items, receiptData.additionalCosts, assignments.length, onItemAssignmentsUpdated, people]);

  const togglePersonAssignment = (itemIndex: number, personId: string) => {
    const newAssignments = [...assignments];
    const itemAssignment = newAssignments[itemIndex];
    
    if (itemAssignment.assignedTo.includes(personId)) {
      itemAssignment.assignedTo = itemAssignment.assignedTo.filter(id => id !== personId);
    } else {
      itemAssignment.assignedTo.push(personId);
    }
    
    setAssignments(newAssignments);
    onItemAssignmentsUpdated(newAssignments);
  };

  const calculatePersonCosts = useMemo((): PersonCost[] => {
    const personCosts: PersonCost[] = people.map(person => ({
      personId: person.id,
      name: person.name,
      amount: 0,
    }));

    // Calculate costs for regular items
    receiptData.items.forEach((item, itemIndex) => {
      const itemAssignment = assignments[itemIndex];
      if (itemAssignment && itemAssignment.assignedTo.length > 0) {
        const costPerPerson = item.price / itemAssignment.assignedTo.length;
        itemAssignment.assignedTo.forEach(personId => {
          const personCost = personCosts.find(pc => pc.personId === personId);
          if (personCost) {
            personCost.amount += costPerPerson;
          }
        });
      }
    });

    // Calculate costs for additional costs (treated as separate assignable items)
    if (receiptData.additionalCosts) {
      receiptData.additionalCosts.forEach((additionalCost, additionalCostIndex) => {
        if (additionalCost.additionalCost) {
          const assignmentIndex = receiptData.items.length + additionalCostIndex;
          const itemAssignment = assignments[assignmentIndex];
          if (itemAssignment && itemAssignment.assignedTo.length > 0) {
            const costPerPerson = additionalCost.amount / itemAssignment.assignedTo.length;
            itemAssignment.assignedTo.forEach(personId => {
              const personCost = personCosts.find(pc => pc.personId === personId);
              if (personCost) {
                personCost.amount += costPerPerson;
              }
            });
          }
        }
      });
    }

    return personCosts;
  }, [people, receiptData.items, receiptData.additionalCosts, assignments]);

  const unclaimedAmount = useMemo(() => {
    const totalAssigned = calculatePersonCosts.reduce((sum, pc) => sum + pc.amount, 0);
    return receiptData.totalPrice - totalAssigned;
  }, [calculatePersonCosts, receiptData.totalPrice]);

  const currencySymbol = receiptData.currencySymbol || '$';

  return (
    <div className="assignment-screen">
      <div className="container">
        <div className="header">
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
          <h1>Assign Items</h1>
        </div>

        <div className="receipt-summary">
          <h3>Total: {currencySymbol}{receiptData.totalPrice.toFixed(2)}</h3>
          <p>{receiptData.items.length} items • {people.length} people</p>
        </div>

        <div className="items-section">
          <h3>Items</h3>
          
          {/* Regular Items */}
          {receiptData.items.map((item, index) => {
            const itemAssignment = assignments[index];
            const isAssignedTo = (personId: string) => 
              itemAssignment?.assignedTo.includes(personId) || false;

            return (
              <div key={index} className="item-card">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p className="item-price">
                    {currencySymbol}{item.price.toFixed(2)}
                    {item.quantity > 1 && ` (×${item.quantity})`}
                  </p>
                </div>
                
                <div className="assignment-buttons">
                  {people.map(person => (
                    <button
                      key={person.id}
                      onClick={() => togglePersonAssignment(index, person.id)}
                      className={`assign-button ${isAssignedTo(person.id) ? 'assigned' : ''}`}
                    >
                      {isAssignedTo(person.id) ? '✓' : '+'} {person.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Additional Costs */}
          {receiptData.additionalCosts && receiptData.additionalCosts.map((additionalCost, additionalCostIndex) => {
            if (!additionalCost.additionalCost) return null;
            
            const assignmentIndex = receiptData.items.length + additionalCostIndex;
            const itemAssignment = assignments[assignmentIndex];
            const isAssignedTo = (personId: string) => 
              itemAssignment?.assignedTo.includes(personId) || false;

            return (
              <div key={`additional-cost-${additionalCostIndex}`} className="item-card additional-cost-card">
                <div className="item-info">
                  <h4>{additionalCost.name}</h4>
                  <p className="item-price">
                    {currencySymbol}{additionalCost.amount.toFixed(2)}
                    <span className="cost-type"> (Additional)</span>
                  </p>
                </div>
                
                <div className="assignment-buttons">
                  {people.map(person => (
                    <button
                      key={person.id}
                      onClick={() => togglePersonAssignment(assignmentIndex, person.id)}
                      className={`assign-button ${isAssignedTo(person.id) ? 'assigned' : ''}`}
                    >
                      {isAssignedTo(person.id) ? '✓' : '+'} {person.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="costs-section">
          <h3>Cost Breakdown</h3>
          <div className="costs-list">
            {calculatePersonCosts.map(personCost => (
              <div key={personCost.personId} className="cost-item">
                <span className="person-name">{personCost.name}</span>
                <span className="cost-amount">
                  {currencySymbol}{personCost.amount.toFixed(2)}
                </span>
              </div>
            ))}
            
            {unclaimedAmount > 0.01 && (
              <div className="cost-item unclaimed">
                <span className="person-name">Unclaimed</span>
                <span className="cost-amount">
                  {currencySymbol}{unclaimedAmount.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AssignmentScreen;
