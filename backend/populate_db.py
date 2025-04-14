import os
import django
import random
from decimal import Decimal

# Configurar ambiente Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'foodmatch.settings')
django.setup()

# Importar modelos após configurar o ambiente
from users.models import User
from recipes.models import Alimento, Bebida, Receita
from matches.models import Match, Carrinho, ReceitaUsuario

# Criar usuário de teste
def criar_usuarios():
    if not User.objects.filter(email='teste@example.com').exists():
        user = User.objects.create_user(
            email='teste@example.com',
            nome='Usuário Teste',
            password='senha123',
            renda=Decimal('3500.00'),
            objetivo_nutricional='Perda de peso'
        )
        print(f'Usuário criado: {user.email}')
    
    if not User.objects.filter(email='admin@example.com').exists():
        admin = User.objects.create_superuser(
            email='admin@example.com',
            nome='Administrador',
            password='admin123'
        )
        print(f'Admin criado: {admin.email}')

# Criar alimentos
def criar_alimentos():
    alimentos = [
        {
            'nome': 'Frango Grelhado',
            'calorias': Decimal('165.00'),
            'proteinas': Decimal('31.00'),
            'carboidratos': Decimal('0.00'),
            'gorduras': Decimal('3.60'),
            'preco_medio': Decimal('15.90')
        },
        {
            'nome': 'Arroz Integral',
            'calorias': Decimal('112.00'),
            'proteinas': Decimal('2.30'),
            'carboidratos': Decimal('23.50'),
            'gorduras': Decimal('0.80'),
            'preco_medio': Decimal('8.50')
        },
        {
            'nome': 'Salada de Grão-de-bico',
            'calorias': Decimal('269.00'),
            'proteinas': Decimal('14.50'),
            'carboidratos': Decimal('45.00'),
            'gorduras': Decimal('4.20'),
            'preco_medio': Decimal('12.00')
        },
        {
            'nome': 'Salmão',
            'calorias': Decimal('208.00'),
            'proteinas': Decimal('20.00'),
            'carboidratos': Decimal('0.00'),
            'gorduras': Decimal('13.00'),
            'preco_medio': Decimal('35.00')
        },
        {
            'nome': 'Batata Doce',
            'calorias': Decimal('86.00'),
            'proteinas': Decimal('1.60'),
            'carboidratos': Decimal('20.00'),
            'gorduras': Decimal('0.10'),
            'preco_medio': Decimal('5.00')
        }
    ]
    
    for alimento_data in alimentos:
        if not Alimento.objects.filter(nome=alimento_data['nome']).exists():
            alimento = Alimento.objects.create(**alimento_data)
            print(f'Alimento criado: {alimento.nome}')

# Criar bebidas
def criar_bebidas():
    bebidas = [
        {
            'nome': 'Suco Verde Detox',
            'calorias': Decimal('45.00'),
            'tipo': 'suco',
            'preco_medio': Decimal('8.00')
        },
        {
            'nome': 'Água de Coco',
            'calorias': Decimal('19.00'),
            'tipo': 'água',
            'preco_medio': Decimal('5.00')
        },
        {
            'nome': 'Chá Verde',
            'calorias': Decimal('2.00'),
            'tipo': 'chá',
            'preco_medio': Decimal('3.50')
        },
        {
            'nome': 'Smoothie de Frutas Vermelhas',
            'calorias': Decimal('120.00'),
            'tipo': 'smoothie',
            'preco_medio': Decimal('12.00')
        },
        {
            'nome': 'Suco de Laranja',
            'calorias': Decimal('45.00'),
            'tipo': 'suco',
            'preco_medio': Decimal('7.00')
        }
    ]
    
    for bebida_data in bebidas:
        if not Bebida.objects.filter(nome=bebida_data['nome']).exists():
            bebida = Bebida.objects.create(**bebida_data)
            print(f'Bebida criada: {bebida.nome}')

# Criar receitas
def criar_receitas():
    receitas = [
        {
            'nome': 'Bowl de Frango com Arroz Integral',
            'ingredientes': '200g de frango grelhado\n1 xícara de arroz integral cozido\nLegumes variados\nAzeite e temperos a gosto',
            'tempo_preparo': 30,
            'calorias_totais': Decimal('450.00')
        },
        {
            'nome': 'Salada de Grão-de-bico com Legumes',
            'ingredientes': '1 xícara de grão-de-bico cozido\nTomate, pepino e cebola roxa\nAzeite, limão e ervas',
            'tempo_preparo': 15,
            'calorias_totais': Decimal('320.00')
        },
        {
            'nome': 'Salmão com Batata Doce',
            'ingredientes': '150g de filé de salmão\n1 batata doce média\nErvas frescas e limão',
            'tempo_preparo': 25,
            'calorias_totais': Decimal('380.00')
        },
        {
            'nome': 'Wrap de Frango',
            'ingredientes': '100g de frango desfiado\n1 tortilha integral\nAlface, tomate e molho de iogurte',
            'tempo_preparo': 10,
            'calorias_totais': Decimal('290.00')
        },
        {
            'nome': 'Bowl de Açaí',
            'ingredientes': '200g de polpa de açaí\nBanana, granola e mel',
            'tempo_preparo': 5,
            'calorias_totais': Decimal('350.00')
        }
    ]
    
    for receita_data in receitas:
        if not Receita.objects.filter(nome=receita_data['nome']).exists():
            receita = Receita.objects.create(**receita_data)
            print(f'Receita criada: {receita.nome}')

# Criar matches
def criar_matches():
    # Garantir que existam alimentos e bebidas
    if Alimento.objects.count() == 0 or Bebida.objects.count() == 0:
        print('É necessário ter alimentos e bebidas cadastrados para criar matches')
        return
    
    # Limpar matches existentes
    Match.objects.all().delete()
    
    alimentos = Alimento.objects.all()
    bebidas = Bebida.objects.all()
    
    # Criar matches específicos
    matches_especificos = [
        {'alimento_nome': 'Salada de Grão-de-bico', 'bebida_nome': 'Suco Verde Detox', 'score': Decimal('9.5')},
        {'alimento_nome': 'Frango Grelhado', 'bebida_nome': 'Água de Coco', 'score': Decimal('8.7')},
        {'alimento_nome': 'Salmão', 'bebida_nome': 'Chá Verde', 'score': Decimal('9.2')}
    ]
    
    for match_data in matches_especificos:
        try:
            alimento = Alimento.objects.get(nome=match_data['alimento_nome'])
            bebida = Bebida.objects.get(nome=match_data['bebida_nome'])
            
            match = Match.objects.create(
                alimento=alimento,
                bebida=bebida,
                score_nutricional=match_data['score'],
                descricao=f'Combinação ideal de {alimento.nome} com {bebida.nome}'
            )
            print(f'Match criado: {match}')
        except (Alimento.DoesNotExist, Bebida.DoesNotExist):
            print(f"Não foi possível criar match com {match_data['alimento_nome']} e {match_data['bebida_nome']}")
    
    # Criar alguns matches aleatórios adicionais
    for _ in range(5):
        alimento = random.choice(alimentos)
        bebida = random.choice(bebidas)
        
        # Evitar duplicatas
        if not Match.objects.filter(alimento=alimento, bebida=bebida).exists():
            score = Decimal(str(round(random.uniform(6.0, 9.0), 1)))
            match = Match.objects.create(
                alimento=alimento,
                bebida=bebida,
                score_nutricional=score,
                descricao=f'Combinação de {alimento.nome} com {bebida.nome}'
            )
            print(f'Match aleatório criado: {match}')

# Função principal
def main():
    print('Iniciando população do banco de dados...')
    criar_usuarios()
    criar_alimentos()
    criar_bebidas()
    criar_receitas()
    criar_matches()
    print('População do banco de dados concluída!')

if __name__ == '__main__':
    main()