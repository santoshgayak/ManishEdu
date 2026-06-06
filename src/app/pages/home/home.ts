import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Hero } from '../../components/hero/hero';
import { Qualities } from '../../components/qualities/qualities';
import { About } from '../../components/about/about';
import { WhyUs } from '../../components/why-us/why-us';
import { Classes } from '../../components/classes/classes';
import { Services } from "../../components/services/services";
import { CallToAction } from "../../components/call-to-action/call-to-action";
import { Team } from '../../components/team/team';
import { Faq } from '../../components/faq/faq';
import { Contact } from '../../components/contact/contact';
import { Footer } from "../../components/footer/footer";


@Component({
  selector: 'app-home',
  imports: [Navbar, Hero, Qualities, About, WhyUs, Classes, Services, CallToAction, Team, Faq, Contact, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
