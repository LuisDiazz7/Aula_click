import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ACTUALIZADO = '3 de noviembre de 2026'

const SECCIONES = [
  {
    id: 'datos',
    titulo: '1. Qué datos recopilamos',
    intro: 'Solo pedimos lo necesario para que puedas estudiar en Aula Click:',
    lista: [
      'Cuenta: tu correo electrónico y tu contraseña. La contraseña la gestiona nuestro proveedor de autenticación y se guarda cifrada; nadie del equipo puede leerla.',
      'Perfil: tu nombre, tu curso (3° o 4° Medio) y tu área.',
      'Progreso: los resultados de tus ejercitaciones (puntaje, respuestas correctas, total de preguntas y tiempo empleado).',
      'Tutor IA: las conversaciones que mantienes con el tutor, para que puedas retomarlas más tarde.',
    ],
  },
  {
    id: 'uso',
    titulo: '2. Para qué los usamos',
    lista: [
      'Crear y proteger tu cuenta, y permitirte recuperar tu contraseña.',
      'Mostrarte contenido acorde a tu curso y registrar tu avance por tema.',
      'Responder tus preguntas en el Tutor IA.',
    ],
    parrafos: [
      'No vendemos ni arrendamos tus datos, no mostramos publicidad y no usamos herramientas de seguimiento ni de analítica de terceros.',
    ],
  },
  {
    id: 'terceros',
    titulo: '3. Con quién los compartimos',
    lista: [
      'Supabase: aloja nuestra base de datos y el inicio de sesión.',
      'Google Gemini: procesa los mensajes que escribes en el Tutor IA para generar la respuesta. Le enviamos solo el texto de la conversación, nunca tu correo ni tu contraseña.',
    ],
    parrafos: [
      'Te recomendamos no escribir datos personales sensibles (como tu RUT, dirección o información de salud) en el Tutor IA.',
    ],
  },
  {
    id: 'seguridad',
    titulo: '4. Cómo protegemos tu información',
    lista: [
      'Toda la comunicación con Aula Click viaja cifrada mediante HTTPS.',
      'Las contraseñas se almacenan con hash y nunca en texto plano.',
      'La base de datos aplica reglas de seguridad a nivel de fila: cada estudiante solo puede ver y modificar su propio perfil, progreso y conversaciones.',
      'Las claves de los servicios de IA se mantienen en el servidor y no quedan expuestas en tu navegador.',
    ],
    parrafos: [
      'Ningún sistema es 100% infalible. Si detectamos un incidente que afecte tus datos, te avisaremos a tu correo lo antes posible.',
    ],
  },
  {
    id: 'consejos',
    titulo: '5. Lo que puedes hacer tú',
    lista: [
      'Usa una contraseña única de al menos 8 caracteres y no la compartas.',
      'Cierra sesión si usas un computador compartido (por ejemplo, en el colegio o en una biblioteca).',
      'Desconfía de correos que te pidan tu contraseña: Aula Click nunca te la pedirá.',
    ],
  },
  {
    id: 'menores',
    titulo: '6. Estudiantes menores de edad',
    parrafos: [
      'Aula Click está pensado para estudiantes de enseñanza media, muchos de ellos menores de 18 años. Por eso recopilamos el mínimo de información posible. Si eres menor de edad, te pedimos revisar esta política junto a tu madre, padre o apoderado.',
    ],
  },
  {
    id: 'derechos',
    titulo: '7. Tus derechos',
    parrafos: [
      'De acuerdo con la Ley N° 19.628 sobre protección de la vida privada y, desde su entrada en vigencia, la Ley N° 21.719 de protección de datos personales, puedes pedir acceso a tus datos, corregirlos, solicitar su eliminación u oponerte a su tratamiento. Puedes actualizar tu perfil en cualquier momento desde la sección Mi perfil.',
    ],
  },
  {
    id: 'conservacion',
    titulo: '8. Cuánto tiempo guardamos tus datos',
    parrafos: [
      'Conservamos tus datos mientras tu cuenta esté activa. Si solicitas eliminar tu cuenta, borraremos tu perfil, tu progreso y tus conversaciones del Tutor IA.',
    ],
  },
  {
    id: 'cambios',
    titulo: '9. Cambios a esta política',
    parrafos: [
      'Si modificamos esta política de forma importante, lo informaremos dentro de la plataforma. La fecha de la última actualización aparece al inicio de esta página.',
    ],
  },
]

export default function Privacidad() {
  const { user } = useAuth()

  return (
    <div className="page legal-page">
      <nav className="breadcrumbs">
        <Link to={user ? '/inicio' : '/'}>Inicio</Link>
        <span>›</span>
        <span>Privacidad y seguridad</span>
      </nav>

      <div className="page-header">
        <span className="page-eyebrow">Legal</span>
        <h1>Política de Privacidad y Seguridad</h1>
        <p>
          En Aula Click cuidamos tu información. Aquí te explicamos, en simple, qué datos
          guardamos, para qué los usamos y cómo los protegemos.
        </p>
        <p className="legal-fecha">Última actualización: {ACTUALIZADO}</p>
      </div>

      <nav className="legal-indice" aria-label="Contenido">
        {SECCIONES.map((s) => (
          <a key={s.id} href={`#${s.id}`}>{s.titulo}</a>
        ))}
      </nav>

      {SECCIONES.map((s) => (
        <section key={s.id} id={s.id} className="legal-seccion">
          <h2>{s.titulo}</h2>
          {s.intro && <p>{s.intro}</p>}
          {s.lista && (
            <ul>
              {s.lista.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
          {s.parrafos?.map((p) => <p key={p}>{p}</p>)}
        </section>
      ))}
    </div>
  )
}
