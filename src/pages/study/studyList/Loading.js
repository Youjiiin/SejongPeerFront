import styled from 'styled-components';

const Loading = ({ text }) => {
    return (
        <Container>
            <LoadingText>{text}</LoadingText>
        </Container>
    );
};

export default Loading;

const Container = styled.div`
    width: 100vw;
    height: 90vh;
    background-color: #FFF;
    position: absolute;
    top: 11vh;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    text-align: center
    z-index: 0;
`;

const LoadingText = styled.div`
    font-size: 18px;
    font-weight: bold;
`;