import './conversor-moedas.css';
import { Jumbotron, Button, Form, Col, Spinner, Alert, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import ListarMoedas from './listar-moedas';
import React, { useState } from 'react';
import axios from 'axios';


function ConversorMoedas() {

    const FIXER_URL = 'http://data.fixer.io/api/latest?access_key=493a93e1ee6866126916d18241dace44';

    const [valor, setValor] = useState('1');
    const [moedaDe, setMoedaDe] = useState('BRL');
    const [moedaPara, setMoedaPara] = useState('USD');
    const [exibirSpinner, setExibirSpinner] = useState(false);
    const [formValidado, setFormValidado] = useState(false);
    const [exibirModal, setExibirModal] = useState(false);
    const [resultadoConversao, setResultadoConversao] = useState('');
    const [exibirMenssagemErro, setExibirMenssagemErro] = useState(false);

    function handleValor(event) {
        setValor(event.target.value.replace(/\D/g, ''));
    }

    function handleMoedaDe(event) {
        setMoedaDe(event.target.value);
    }

    function handleMoedaPara(event) {
        setMoedaPara(event.target.value);
    }

    function handleFecharModal(event){
        setValor('1');
        setMoedaDe('BRL');
        setMoedaPara('USD');
        setFormValidado(false);
        setExibirModal(false);
    }

    function converter(event) {
        event.preventDefault();
        setFormValidado(true);

        if (event.currentTarget.checkValidity() === true) {
            setExibirSpinner(true);
            axios.get(FIXER_URL)
                .then(res => {
                    const cotacao = obterCotacao(res.data);  
                   if(cotacao){
                    setResultadoConversao(`${valor} ${moedaDe} = ${cotacao} ${moedaPara}`);  
                    setExibirModal(true);
                    setExibirSpinner(false);
                    setExibirMenssagemErro(false);
                   }
                   else{
                       exibirError();
                   }
                }).catch(err => exibirError());
        }

    }

    function obterCotacao(dadosCotacao){
        if(!dadosCotacao || dadosCotacao.success !== true){
            return false;
        }

        const cotacaoDe = dadosCotacao.rates[moedaDe];
        const cotacaoPara = dadosCotacao.rates[moedaPara];
        const cotacao = (1 / cotacaoDe * cotacaoPara) * valor;
        return cotacao.toFixed(2);
    }

    function exibirError(){
        setExibirMenssagemErro(true);
        setExibirSpinner(false);
    }

    return (
        <div>
            <h1>Conversor de Moedas</h1>
            <Alert variant="danger" show={exibirMenssagemErro}>
                Erro obtendo dados de conversão, tente novamente
            </Alert>
            <Jumbotron>
                <Form onSubmit={converter} noValidate validated={formValidado}>
                    <Form.Row>
                        <Col sm="3">
                            <Form.Control placeholder="0" value={valor} onChange={handleValor} required />
                        </Col>

                        <Col sm="3">
                            <Form.Control as="select" value={moedaDe} onChange={handleMoedaDe}>
                                <ListarMoedas />
                            </Form.Control>
                        </Col>

                        <Col sm="1" className="text-center" style={{ paddingTop: '5px' }}>
                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                        </Col>

                        <Col sm="3">
                            <Form.Control as="select" value={moedaPara} onChange={handleMoedaPara}>
                                <ListarMoedas />
                            </Form.Control>
                        </Col>

                        <Col sm="2">
                            <Button variant="success" type="submit">
                                <span className={exibirSpinner ? null : 'hidden'}>
                                    <Spinner animation="border" size="sm" />
                                </span>
                                <span className={exibirSpinner ? 'hidden' : null}>
                                    Converter
                                </span>
                            </Button>
                        </Col>
                    </Form.Row>
                </Form>
                <Modal show={exibirModal} onHide={handleFecharModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Conversão</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {resultadoConversao}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={handleFecharModal}>Nova Conversão</Button>
                    </Modal.Footer>
                </Modal>
            </Jumbotron>
        </div>
    );
}

export default ConversorMoedas;
