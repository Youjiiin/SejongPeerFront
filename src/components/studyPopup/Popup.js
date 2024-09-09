// Popup.js
import React from 'react';
import styled from 'styled-components';
import COLORS from '../../theme';

const Popup = ({ title, message, onClose }) => {
  return (
    <PopupContainer>
      <PopupContent>
        <PopupTitle>{title}</PopupTitle>
        <PopupMessage>{message}</PopupMessage>
        <ConfirmButton onClick={onClose}>확인</ConfirmButton>
      </PopupContent>
    </PopupContainer>
  );
};

export default Popup;

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  padding: 20px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  justify-content: center;
  flex-direction: row;
`;

const PopupContent = styled.div`
  display: flex;
  text-align: center;
  color: ${COLORS.font1};
  flex-direction: column;
`;

const PopupTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const PopupMessage = styled.p`
  font-size: 14px;
  color: ${COLORS.font2};
  line-height: 1;
  margin-bottom: 20px;
`;

const ConfirmButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: ${COLORS.main};
  color: white;
  font-size: 16px;
  cursor: pointer;
`;
