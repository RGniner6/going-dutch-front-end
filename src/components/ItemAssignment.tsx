import React, { useState } from 'react'
import { Person } from '../types/receipt'
import './ItemAssignment.css'

interface ItemAssignmentProps {
  itemName: string
  itemPrice: number
  currencySymbol: string
  people: Person[]
  assignedTo: string[]
  onAssignmentChange: (assignedTo: string[]) => void
}

const ItemAssignment: React.FC<ItemAssignmentProps> = ({
  itemName,
  itemPrice,
  currencySymbol,
  people,
  assignedTo,
  onAssignmentChange,
}) => {
  const [showPeopleList, setShowPeopleList] = useState(false)

  const togglePerson = (personId: string) => {
    const newAssignedTo = assignedTo.includes(personId)
      ? assignedTo.filter(id => id !== personId)
      : [...assignedTo, personId]
    
    onAssignmentChange(newAssignedTo)
  }

  const assignedPeople = people.filter(person => assignedTo.includes(person.id))
  const unassignedPeople = people.filter(person => !assignedTo.includes(person.id))

  return (
    <div className="item-assignment">
      <div className="item-header">
        <div className="item-info">
          <h4>{itemName}</h4>
          <p className="item-price">
            {currencySymbol}{itemPrice.toFixed(2)}
          </p>
        </div>
        
        <button
          className="add-button"
          onClick={() => setShowPeopleList(!showPeopleList)}
        >
          {assignedTo.length > 0 ? (
            <span className="assigned-count">{assignedTo.length}</span>
          ) : (
            <span className="plus-icon">+</span>
          )}
        </button>
      </div>

      {assignedPeople.length > 0 && (
        <div className="assigned-people">
          {assignedPeople.map(person => (
            <div key={person.id} className="assigned-person">
              <span>{person.name}</span>
              <button
                className="remove-person"
                onClick={() => togglePerson(person.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {showPeopleList && (
        <div className="people-selection">
          <div className="people-list">
            {unassignedPeople.map(person => (
              <button
                key={person.id}
                className="person-option"
                onClick={() => togglePerson(person.id)}
              >
                {person.name}
              </button>
            ))}
            {unassignedPeople.length === 0 && (
              <p className="no-people">All people assigned</p>
            )}
          </div>
          <button
            className="close-selection"
            onClick={() => setShowPeopleList(false)}
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}

export default ItemAssignment
