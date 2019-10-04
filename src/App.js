import React from 'react';
import './App.scss';

class ElementoLista extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      'texto':props.texto,
      'filhos':typeof props.filhos !== 'undefined' ? props.filhos : [],
      'link':typeof props.link !== 'undefined' ? props.link : false,
      onClick: typeof props.onClick !== 'undefined' ? props.onClick : function(){}
    }
    this.ref = React.createRef();
    this.renderFilhos = this.renderFilhos.bind(this);
    this.classesAdicionais = typeof props.classesAdicionais !== 'undefined' ? props.classesAdicionais : [];
    this.elementoClickado = this.elementoClickado.bind(this);
    this.listaFilhos = React.createRef();
    this.classe = this.classe.bind(this);
  }
  classe(){
    const classes = [
      'elemento'
    ];
    for(let i = 0; i < this.classesAdicionais.length; i++){
      classes.push('elemento-'+this.classesAdicionais[i]);
    }
    return classes.join(' ');
  }
  elementoClickado(event){
    if(this.state.filhos.length > 0){
      this.listaFilhos.current.toggle();
    }else{
      this.state.onClick(event);
    }
  }
  renderFilhos(){
    if(this.state.filhos.length > 0){
      return(
        [
          <div onClick={this.elementoClickado} className="lista-up">
            <a className="texto">
              {this.state.texto}
            </a>
          </div>,
          <Lista elementos={this.state.filhos} ref={this.listaFilhos}/>,
          <div onClick={this.elementoClickado} className="lista-down">
            <a className="texto">
              {this.state.texto}
            </a>
          </div>
        ]
      );
    }else{
      if(this.state.link){
        return(
          <a onClick={this.elementoClickado} href={this.state.link} target="_blank">{this.state.texto}</a>
        );
      }
      return(
        <a onClick={this.elementoClickado}>{this.state.texto}</a>
      );
    }
  }
  render(){
    return(
      <li ref={this.ref} className={this.classe()}>
        {this.renderFilhos()}
      </li>
    )
  }
}
class Lista extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      status: typeof props.status !== 'undefined'? props.status : 'fechada',
      elementos: props.elementos
    };
    this.ref = React.createRef();
    this.classesAdicionais = typeof props.classesAdicionais !== 'undefined' ? props.classesAdicionais : [];
    this.classe = this.classe.bind(this);
    this.abrir = this.abrir.bind(this);
    this.fechar = this.fechar.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  abrir(){
    this.setState(
      {
        status:'abrindo'
      },
      ()=>{
        setTimeout(
          ()=>{
            this.setState(
              {
                status:'aberta'
              }
            );
          },1000
        );
      }
    )
  }
  fechar(){
    this.setState(
      {
        status:'fechando'
      },
      ()=>{
        setTimeout(
          ()=>{
            this.setState(
              {
                status:'fechada'
              }
            );
          },500
        );
      }
    )
  }
  toggle(){
    if(this.state.status == 'aberta'){
      this.fechar();
    }else if(this.state.status === 'fechada'){
      this.abrir();
    }
  }
  classe(){
    const classes = [
      'lista'
    ];
    classes.push('lista-'+this.state.status);
    for(let i = 0; i < this.classesAdicionais.length; i++){
      classes.push(this.classesAdicionais[i]);
    }
    return classes.join(' ');
  }
  renderElementos(){
    return this.state.elementos;
  }
  render(){
    return(
      <ul ref={this.ref} className={this.classe()}>
        {this.renderElementos()}
      </ul>
    )
  }
}

class Categoria extends ElementoLista{
  constructor(props){
    super(props);
    this.up = React.createRef();
    this.down = React.createRef();
    this.state = {};
    this.classesAdicionais.push('categoria');
    this.state.filhos = [];
  }
}

class Arte extends Categoria{
  constructor(props){
    super(props);
    this.state.texto = "art";
    this.state.filhos = [
      <ElementoLista texto={"ilustrações"}
        filhos={
          [
            <ElementoLista texto={"digital"}
              filhos={
                [
                  <ElementoLista texto={"digital vol.1"} link={"https://www.behance.net/gallery/74537981/Digital-vol1"}/>,
                  <ElementoLista texto={"january 2014"} link={"https://www.behance.net/gallery/14186847/January-2014"}/>,
                  <ElementoLista texto={"pics & monsters"} link={"https://www.behance.net/gallery/9333441/Pics-Monsters"}/>,
                  <ElementoLista texto={"november / december 2013"} link={"https://www.behance.net/gallery/13472405/November-December-2013"}/>,
                  <ElementoLista texto={"frik festival inusual"} link={"https://www.behance.net/gallery/12677379/Frik-Festival-Inusual"}/>,
                  <ElementoLista texto={"september / october 2013"} link={"https://www.behance.net/gallery/11856893/September-October-2013"}/>,
                  <ElementoLista texto={"july / august 2013"} link={"https://www.behance.net/gallery/10701485/July-August-2013"}/>,
                  <ElementoLista texto={"april / june 2013"} link={"https://www.behance.net/gallery/9586087/April-June-2013"}/>,
                  <ElementoLista texto={"february / march 2013"} link={"https://www.behance.net/gallery/8139473/February-March-2013"}/>,
                  <ElementoLista texto={"december 2012 / january 2013"} link={"https://www.behance.net/gallery/7051915/December-January-2012-2013"}/>,
                  <ElementoLista texto={"beatles"} link={"https://www.behance.net/gallery/24179497/Beatles"}/>
                ]
            }/>,
            <ElementoLista texto={"tradicional"}
              filhos={
                [
                  <ElementoLista texto={"vol.1"} link={"https://www.behance.net/gallery/25707463/Traditional-vol1"}/>,
                  <ElementoLista texto={"vol.2"} link={"https://www.behance.net/gallery/26529843/Traditional-vol2"}/>,
                  <ElementoLista texto={"vol.3"} link={"https://www.behance.net/gallery/30139241/Traditional-vol3"}/>,
                  <ElementoLista texto={"vol.4"} link={"https://www.behance.net/gallery/74537705/Traditional-vol4"}/>
                ]
            }/>,
            <ElementoLista texto={"sketchbook"}
              filhos={
                [
                  <ElementoLista texto={"vol.1"} link={"https://www.behance.net/gallery/26528109/Sketchbook-vol1"}/>,
                  <ElementoLista texto={"vol.2"} link={"https://www.behance.net/gallery/30138149/Sketchbook-vol2"}/>,
                  <ElementoLista texto={"vol.3"} link={"https://www.behance.net/gallery/74536591/Sketchbook-vol3"}/>
                ]
            }/>
          ]
        }
      />,
      <ElementoLista texto={"poesía"}
        filhos={
          [
            <ElementoLista texto={"español"}
              filhos={
                [
                  <ElementoLista texto={"sobre 2018, sobre lo que sentí este año o las pocas cosas que no me animé a decir pero tuve coraje de escribir"} link={"https://medium.com/@facundoleites/sobre-2018-sobre-lo-que-sent%C3%AD-este-a%C3%B1o-o-las-pocas-cosas-que-no-me-anim%C3%A9-a-decir-pero-tuve-coraje-12c1ca9e6d25"}/>,
                ]
            }/>,
            <ElementoLista texto={"português"}
              filhos={
                [
                  <ElementoLista texto={"sobre 2018, o que senti ou o que não tive coragem de dizer mas consegui escrever"} link={"https://medium.com/@facundoleites/sobre-2018-o-que-senti-ou-o-que-n%C3%A3o-tive-coragem-de-dizer-mas-consegui-escrever-4fe5fdfb19be"}/>,
                ]
            }/>,
          ]
        }
      />
    ]
  }
}

class Code extends Categoria{
  constructor(props){
    super(props);
    this.state.texto = "code";
    this.state.filhos = [
      <ElementoLista texto={"frontend"}
        filhos={
          [
            <ElementoLista texto={"gigabox"} link={"https://medium.com/@facundoleites/desenvolvimento-frontend-gigabox-5631fd450671?source=---------2------------------"}/>,
            <ElementoLista texto={"barra de navegação responsiva (html, css e js)"} link={"https://medium.com/@facundoleites/barra-de-navega%C3%A7%C3%A3o-responsiva-html-css-e-js-b6987801abd4?source=---------3------------------"}/>
          ]
        }
      />
    ]
  }
}

class Design extends Categoria{
  constructor(props){
    super(props);
    this.state.texto = "design";
    this.state.filhos = [
      <ElementoLista texto={"ux / ui"}
        filhos={
          [
            <ElementoLista texto={"e-solutions"} link={"http://e-ssti.com.br/"}/>,
            <ElementoLista texto={"congo fm - app redesign"} link={"https://www.behance.net/gallery/85055369/CONGO-FM-App-redesign"}/>
          ]
        }
      />,
      <ElementoLista texto={"gráfico"}
        filhos={
          [
            <ElementoLista texto={"e-solutions branding"} link={"https://www.behance.net/gallery/86378895/E-Solutions-Branding"}/>,
            <ElementoLista texto={"saxo dúo"} link={"https://www.behance.net/gallery/7535961/Saxo-Duo"}/>,
            <ElementoLista texto={"oberá en cortos 2013"} link={"https://www.behance.net/gallery/15155001/Obera-en-Cortos-2013"}/>,
            <ElementoLista texto={"myth"} link={"https://www.behance.net/gallery/7535961/Saxo-Duo"}/>,
            <ElementoLista texto={"musica para los ojos"} link={"https://www.behance.net/gallery/7535961/Saxo-Duo"}/>,
            <ElementoLista texto={"polémica en el bar"} link={"https://www.behance.net/gallery/7535961/Saxo-Duo"}/>,
            <ElementoLista texto={"15 años sol"} link={"https://www.behance.net/gallery/7535961/Saxo-Duo"}/>,
            <ElementoLista texto={"yourself"} link={"https://www.behance.net/gallery/7535961/Saxo-Duo"}/>
          ]
        }
      />
    ]
  }
}


class ContainerMain extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
        <Lista status={'aberta'} elementos={
          [
            <Arte></Arte>,
            <Code></Code>,
            <Design></Design>
          ]
        }
        />
    );
  }
}

class Contato extends Categoria{
  constructor(props){
    super(props);
    this.state.texto = "contato";
    this.state.filhos = [
      <ElementoLista texto={"hola@facundoleites.com"} link={"mailto:hola@facundoleites.com"}/>,
      <ElementoLista texto={"twitter"} link={"http://www.twitter.com/facundoleites"}/>,
      <ElementoLista texto={"instagram"} link={"http://www.instagram.com/leitesfacundo"}/>,
      <ElementoLista texto={"behance"} link={"http://www.behance.net/facundoleites"}/>,
      <ElementoLista texto={"facebook"} link={"http://www.facebook.com/facundoleites"}/>,
      <ElementoLista texto={"linkedin"} link={"http://www.linkedin.com/in/facundoleites"}/>,
      <ElementoLista texto={"medium"} link={"https://medium.com/@facundoleites"}/>,
      <ElementoLista texto={"discord"} link={"https://discordapp.com/invite/fU6tUAz"}/>,
    ]
  }
}


class Footer extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <footer className="contato">
        <Lista status={'aberta'} elementos={
          [
            <Contato/>,
          ]
        }
        />
      </footer>
    );
  }
}

class Header extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <header className="header">
        <h1>Facundo Leites</h1>
      </header>
    );
  }
}

function App() {
  return (
    [
      <Header></Header>,
      <ContainerMain></ContainerMain>,
      <Footer></Footer>
    ]
  );
}

export default App;