

Create type tfilm as object (
          id_film varchar2(8),
          nom_realisateur varchar2(25),
          budget_production number,
          date_sortie date
);

Create type tprogrammation as object (
          id_prog varchar2(8),
          salle integer,
          ville varchar2(25), 
          date_prog date,
          id_film ref tfilm
);

create type tvu as object (
          id_vu varchar2(8), 
          nom_spectateur varchar2(25),
          prix_billet number,
          id_prog ref tprogrammation 
);


create type t_set_vu as table of ref tvu; 
create type t_set_programmation as table of ref tprogrammation;

alter type tfilm add attribute film_programmations t_set_programmation cascade; 
alter type tprogrammation add attribute programmation_vues t_set_vu cascade; 



create table vu of tvu(constraint pk primary key (id_vu) , constraint fk_1 foreign key(id_prog) refrences programmation); 
create table programmation of tprogrammation(
                    constraint pk primary key (id_prog),
                    constraint fk foreign key (id_film) refrences film
          ),
          nested table programmation_vues stored as programmation_vues_table;

create table film of tfilm(constraint pk primary key (id_film)),
          nested table film_programmations stored as film_programmations_table; 



alter type tfilm add member function MesSpectateurs return t_set_vu cascade;

create or replace type body tfilm as member function MesSpectateurs return t_set_vu is vues t_set_vu;
          begin
                    select distinct v.nom_spectateur 
                              from table(slef.t_set_programmation) p,
                              table(p.t_set_vu) v into vues;
                    from dual; 
                    return vues;
          end;
end; 


select  SUM(v.prix_billet) as benefice
          from film f , table(f.t_set_programmation) p, table (p.t_set_vu) v
          group by f.id_film dec
                               
